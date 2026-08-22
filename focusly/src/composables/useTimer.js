/**
 * 番茄专注计时模块
 *
 * - 支持自定义学习/休息时长
 * - 开始 / 暂停 / 重置，倒计时表盘展示
 * - 计时结束自动提醒，切换学习/休息模式
 * - 使用时间戳差值计算，杜绝时间漂移
 * - 单定时器管理，暂停/重置/模式切换时清理，杜绝叠加与内存泄漏
 * - 学习时长实时累计到“当日专注时长”，供打卡使用
 */

import { ref, computed, onBeforeUnmount } from 'vue'
import { fetchTimerConfig, saveTimerConfig } from '../api/timer'
import { formatClock, formatDate, formatDateTime } from '../utils/date'
import { getStorage, setStorage, MEMORY_KEYS } from '../utils/storage'

const TODAY_STUDY_KEY = MEMORY_KEYS.TODAY_STUDY

function readTodayStudy() {
  const map = getStorage(TODAY_STUDY_KEY, {})
  const d = formatDate()
  return Number(map[d]) || 0
}

function writeTodayStudy(ms) {
  const map = getStorage(TODAY_STUDY_KEY, {})
  map[formatDate()] = Math.round(ms)
  setStorage(TODAY_STUDY_KEY, map)
}

export function useTimer() {
  const studyDuration = ref(25)
  const restDuration = ref(5)
  const mode = ref('study') // study | rest
  const status = ref('idle') // idle | running | paused
  const remaining = ref(0) // 剩余毫秒
  const totalMs = computed(() => (mode.value === 'study' ? studyDuration.value : restDuration.value) * 60 * 1000)
  const todayStudyMs = ref(readTodayStudy())
  const loading = ref(false) // 配置加载状态
  const sessionTick = ref(0) // 每个专注/休息轮次完成 +1，供图表自动刷新

  let timerId = null
  let lastStamp = 0

  const display = computed(() => formatClock(remaining.value))
  const progress = computed(() => (totalMs.value ? 1 - remaining.value / totalMs.value : 0))

  function clearTimer() {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }
  }

  function tick() {
    const now = Date.now()
    const elapsed = now - lastStamp
    lastStamp = now
    remaining.value = Math.max(0, remaining.value - elapsed)

    // 学习模式：实时累计当日专注时长
    if (mode.value === 'study') {
      todayStudyMs.value += elapsed
      writeTodayStudy(todayStudyMs.value)
    }

    if (remaining.value <= 0) {
      remaining.value = 0
      clearTimer()
      status.value = 'idle'
      handleSessionEnd()
    }
  }

  function handleSessionEnd() {
    if (mode.value === 'study') {
      // 学习结束 -> 提示进入休息
      notify('学习完成！休息一下，进入休息模式 ~')
      mode.value = 'rest'
    } else {
      notify('休息结束！继续专注学习吧 💪')
      mode.value = 'study'
    }
    remaining.value = totalMs.value
    sessionTick.value++ // 通知外部（图表等）自动刷新
  }

  function start() {
    if (status.value === 'running') return
    clearTimer()
    if (remaining.value <= 0) {
      remaining.value = totalMs.value
    }
    status.value = 'running'
    lastStamp = Date.now()
    timerId = setInterval(tick, 250)
  }

  function pause() {
    if (status.value !== 'running') return
    clearTimer()
    status.value = 'paused'
  }

  function reset() {
    clearTimer()
    status.value = 'idle'
    remaining.value = totalMs.value
  }

  function switchMode(next) {
    clearTimer()
    mode.value = next
    status.value = 'idle'
    remaining.value = totalMs.value
  }

  /** 保存自定义时长，并进行输入校验 */
  function applyConfig({ study, rest }) {
    const s = Number(study)
    const r = Number(rest)
    if (!Number.isFinite(s) || s <= 0 || s > 180) return { ok: false, msg: '学习时长需为 1-180 分钟的数字' }
    if (!Number.isFinite(r) || r <= 0 || r > 60) return { ok: false, msg: '休息时长需为 1-60 分钟的数字' }
    clearTimer()
    studyDuration.value = s
    restDuration.value = r
    status.value = 'idle'
    remaining.value = totalMs.value
    saveTimerConfig({ studyDuration: s, restDuration: r })
    return { ok: true, msg: '计时配置已保存' }
  }

  async function loadConfig() {
    loading.value = true
    try {
      const cfg = await fetchTimerConfig()
      studyDuration.value = Number(cfg.studyDuration) || 25
      restDuration.value = Number(cfg.restDuration) || 5
      remaining.value = totalMs.value
    } finally {
      loading.value = false
    }
  }

  onBeforeUnmount(clearTimer)

  return {
    studyDuration,
    restDuration,
    mode,
    status,
    remaining,
    display,
    progress,
    loading,
    sessionTick,
    todayStudyMs: computed(() => Math.round(todayStudyMs.value / 60000)),
    start,
    pause,
    reset,
    switchMode,
    applyConfig,
    loadConfig
  }
}

/** 简单文字提醒（可替换为更优雅的通知组件） */
function notify(msg) {
  const el = document.getElementById('timer-toast')
  if (el) {
    el.textContent = msg
    el.classList.add('show')
    clearTimeout(el._t)
    el._t = setTimeout(() => el.classList.remove('show'), 4000)
  }
}

export function notifyMsg(msg) {
  notify(msg)
}

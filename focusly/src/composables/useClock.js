/**
 * 每日学习打卡模块
 *
 * - 每日一次打卡，记录日期 + 当日专注总时长（分钟）
 * - 同一日期禁止重复打卡
 * - 打卡记录本地永久保存
 * - 提供日历高亮展示所需数据
 */

import { ref, computed } from 'vue'
import { fetchClockList, addClock as apiAddClock } from '../api/clock'
import { getStorage, setStorage, STORAGE_KEYS, MEMORY_KEYS } from '../utils/storage'
import { today, formatDate, formatDateTime } from '../utils/date'

export function useClock() {
  const clockList = ref([])
  const loading = ref(false)

  function readTodayStudyMs() {
    const map = getStorage(MEMORY_KEYS.TODAY_STUDY, {})
    return Number(map[today()]) || 0
  }

  function persist() {
    setStorage(STORAGE_KEYS.CLOCK_LIST, clockList.value)
  }

  const isClockedToday = computed(() => clockList.value.some((r) => r.date === today()))
  const todayRecord = computed(() => clockList.value.find((r) => r.date === today()) || null)
  const todayStudyMinutes = computed(() => Math.round(readTodayStudyMs() / 60000))

  async function loadClockList() {
    loading.value = true
    try {
      const list = await fetchClockList()
      const local = getStorage(STORAGE_KEYS.CLOCK_LIST, null)
      clockList.value = Array.isArray(local) ? local : list
      if (clockList.value.length === 0) persist()
    } finally {
      loading.value = false
    }
  }

  /** 提交今日打卡 */
  async function clockIn() {
    if (isClockedToday.value) {
      return { ok: false, msg: '今天已经打过卡啦，明天再来吧' }
    }
    const studyTime = Math.max(0, Math.round(readTodayStudyMs() / 60000))
    const record = {
      date: today(),
      studyTime,
      createTime: formatDateTime()
    }
    const res = await apiAddClock(record)
    // 无论接口成败，本地都记录，保证离线可用
    const idx = clockList.value.findIndex((r) => r.date === record.date)
    if (idx >= 0) clockList.value[idx] = record
    else clockList.value.push(record)
    persist()
    return { ok: true, msg: res.ok ? '今日打卡成功！继续加油' : `打卡成功（本地模式）：${res.msg}`, record }
  }

  /** 该日期是否有打卡记录 */
  function hasClock(dateStr) {
    return clockList.value.some((r) => r.date === dateStr)
  }

  return { clockList, loading, isClockedToday, todayRecord, todayStudyMinutes, loadClockList, clockIn, hasClock }
}

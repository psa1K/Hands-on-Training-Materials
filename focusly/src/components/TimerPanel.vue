<template>
  <section class="panel timer-panel">
    <h2 class="panel-title">🍅 番茄专注计时</h2>

    <!-- 模式切换 -->
    <div class="mode-tabs">
      <button
        class="mode-tab"
        :class="{ active: timer.mode === 'study' }"
        @click="switchTo('study')"
      >专注</button>
      <button
        class="mode-tab"
        :class="{ active: timer.mode === 'rest' }"
        @click="switchTo('rest')"
      >休息</button>
    </div>

    <!-- 可视化表盘 -->
    <div class="dial-wrap">
      <svg viewBox="0 0 200 200" class="dial">
        <circle class="dial-bg" cx="100" cy="100" r="88" />
        <circle
          class="dial-fg"
          :class="{ rest: timer.mode === 'rest' }"
          cx="100"
          cy="100"
          r="88"
          :style="ringStyle"
        />
      </svg>
      <div class="dial-center">
        <div class="dial-time">{{ timer.display }}</div>
        <div class="dial-label">{{ timer.mode === 'study' ? '专注中' : '休息中' }}</div>
      </div>
    </div>

    <!-- 今日专注 -->
    <div class="today-study">
      今日已专注 <strong>{{ timer.todayStudyMs }}</strong> 分钟
    </div>

    <!-- 控制按钮 -->
    <div class="timer-controls">
      <button class="btn primary" @click="timer.start" v-if="timer.status !== 'running'">
        {{ timer.status === 'paused' ? '继续' : '开始' }}
      </button>
      <button class="btn primary" @click="timer.pause" v-else>暂停</button>
      <button class="btn" @click="timer.reset">重置</button>
    </div>

    <!-- 自定义时长 -->
    <div class="config-box">
      <h3 class="config-title">自定义时长</h3>
      <div class="config-row">
        <label>
          <span>学习（分钟）</span>
          <input v-model.number="studyInput" type="number" min="1" max="180" />
        </label>
        <label>
          <span>休息（分钟）</span>
          <input v-model.number="restInput" type="number" min="1" max="60" />
        </label>
      </div>
      <button class="btn outline" @click="saveConfig">保存配置</button>
      <p class="config-msg">{{ configMsg }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTimer } from '../composables/useTimer'

const emit = defineEmits(['changed'])

const timer = useTimer()
const studyInput = ref(25)
const restInput = ref(5)
const configMsg = ref('')

const R = 88
const CIRC = 2 * Math.PI * R
const ringStyle = computed(() => ({
  strokeDasharray: CIRC,
  strokeDashoffset: CIRC * (1 - timer.progress)
}))

onMounted(async () => {
  await timer.loadConfig()
  studyInput.value = timer.studyDuration
  restInput.value = timer.restDuration
})

function switchTo(mode) {
  timer.switchMode(mode)
}

function saveConfig() {
  const res = timer.applyConfig({ study: studyInput.value, rest: restInput.value })
  configMsg.value = res.msg
  if (res.ok) {
    studyInput.value = timer.studyDuration
    restInput.value = timer.restDuration
    emit('changed')
  }
  setTimeout(() => (configMsg.value = ''), 3000)
}
</script>

<style scoped>
.mode-tabs {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 18px;
}
.mode-tab {
  border: none;
  background: var(--bg-soft);
  color: var(--text-dim);
  padding: 6px 22px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.25s;
}
.mode-tab.active {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 4px 12px rgba(255, 111, 97, 0.35);
}
.dial-wrap {
  position: relative;
  width: 220px;
  height: 220px;
  margin: 0 auto 12px;
}
.dial {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.dial-bg {
  fill: none;
  stroke: var(--bg-soft);
  stroke-width: 12;
}
.dial-fg {
  fill: none;
  stroke: var(--primary);
  stroke-width: 12;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.25s linear, stroke 0.3s;
}
.dial-fg.rest {
  stroke: var(--accent);
}
.dial-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.dial-time {
  font-size: 40px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text);
}
.dial-label {
  margin-top: 4px;
  font-size: 13px;
  color: var(--text-dim);
}
.today-study {
  text-align: center;
  color: var(--text-dim);
  font-size: 14px;
  margin-bottom: 16px;
}
.today-study strong {
  color: var(--primary);
  font-size: 18px;
}
.timer-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
}
.config-box {
  background: var(--bg-soft);
  border-radius: 14px;
  padding: 16px;
}
.config-title {
  font-size: 14px;
  margin-bottom: 12px;
  color: var(--text);
}
.config-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}
.config-row label {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--text-dim);
}
.config-row input {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 14px;
  background: #fff;
  outline: none;
}
.config-row input:focus {
  border-color: var(--primary);
}
.config-msg {
  margin-top: 8px;
  font-size: 12px;
  color: var(--primary);
  min-height: 16px;
}
</style>

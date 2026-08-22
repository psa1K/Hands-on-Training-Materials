<template>
  <section class="panel clock-panel">
    <h2 class="panel-title">✅ 每日学习打卡</h2>

    <div class="clock-status" :class="{ done: clock.isClockedToday.value }">
      <div class="clock-big">
        {{ clock.isClockedToday.value ? '今日已打卡' : '今日未打卡' }}
      </div>
      <div class="clock-today-min">
        今日专注 <strong>{{ clock.todayStudyMinutes }}</strong> 分钟
        <span v-if="clock.todayRecord">· 打卡记录 {{ clock.todayRecord.studyTime }} 分钟</span>
      </div>
    </div>

    <button
      class="btn primary clock-btn"
      :disabled="clock.isClockedToday.value"
      @click="doClockIn"
    >
      {{ clock.isClockedToday.value ? '明天再来吧 🎉' : '今日打卡' }}
    </button>
    <p class="tip">{{ msg }}</p>

    <!-- 月度日历 -->
    <div class="calendar">
      <div class="cal-head">
        <button class="cal-nav" @click="shiftMonth(-1)">‹</button>
        <span class="cal-title">{{ calYear }} 年 {{ calMonth + 1 }} 月</span>
        <button class="cal-nav" @click="shiftMonth(1)">›</button>
      </div>
      <div class="cal-grid cal-week">
        <span v-for="w in weekNames" :key="w">{{ w }}</span>
      </div>
      <div class="cal-grid cal-days">
        <span v-for="(d, i) in calCells" :key="i"
          class="cal-cell"
          :class="{
            blank: !d,
            checked: d && clock.hasClock(d.dateStr),
            today: d && d.dateStr === todayStr
          }"
          :title="d ? (clock.hasClock(d.dateStr) ? d.dateStr + ' 已打卡' : d.dateStr) : ''"
        >{{ d ? d.day : '' }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useClock } from '../composables/useClock'
import { formatDate, addDays } from '../utils/date'

const emit = defineEmits(['clocked'])

const clock = useClock()
const msg = ref('')
const todayStr = formatDate()

const now = new Date()
const calYear = ref(now.getFullYear())
const calMonth = ref(now.getMonth())

const weekNames = ['日', '一', '二', '三', '四', '五', '六']

const calCells = computed(() => {
  const first = new Date(calYear.value, calMonth.value, 1)
  const startWeek = first.getDay()
  const daysInMonth = new Date(calYear.value, calMonth.value + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startWeek; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      day,
      dateStr: formatDate(new Date(calYear.value, calMonth.value, day))
    })
  }
  return cells
})

onMounted(() => clock.loadClockList())

function shiftMonth(offset) {
  const d = new Date(calYear.value, calMonth.value + offset, 1)
  calYear.value = d.getFullYear()
  calMonth.value = d.getMonth()
}

async function doClockIn() {
  const res = await clock.clockIn()
  msg.value = res.msg
  if (res.ok) {
    emit('clocked')
    setTimeout(() => (msg.value = ''), 4000)
  }
}
</script>

<style scoped>
.clock-status {
  background: var(--bg-soft);
  border-radius: 14px;
  padding: 16px;
  text-align: center;
  margin-bottom: 12px;
}
.clock-status.done {
  background: rgba(67, 160, 71, 0.12);
}
.clock-big {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 6px;
}
.clock-today-min {
  font-size: 13px;
  color: var(--text-dim);
}
.clock-today-min strong {
  color: var(--primary);
  font-size: 16px;
}
.clock-btn {
  width: 100%;
  margin-bottom: 6px;
}
.clock-btn:disabled {
  background: var(--accent);
  cursor: default;
  box-shadow: none;
}
.tip {
  font-size: 12px;
  color: var(--primary);
  text-align: center;
  min-height: 18px;
  margin-bottom: 6px;
}
.calendar {
  background: var(--bg-soft);
  border-radius: 14px;
  padding: 12px;
}
.cal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.cal-nav {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: var(--text-dim);
  padding: 0 8px;
}
.cal-title {
  font-size: 14px;
  font-weight: 600;
}
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  text-align: center;
}
.cal-week span {
  font-size: 12px;
  color: var(--text-dim);
  padding: 4px 0;
}
.cal-cell {
  font-size: 13px;
  padding: 7px 0;
  border-radius: 8px;
  color: var(--text);
  transition: all 0.2s;
}
.cal-cell.blank {
  visibility: hidden;
}
.cal-cell.checked {
  background: var(--primary);
  color: #fff;
}
.cal-cell.today:not(.checked) {
  box-shadow: inset 0 0 0 2px var(--primary);
  color: var(--primary);
  font-weight: 700;
}
.cal-cell:not(.blank):not(.checked):hover {
  background: rgba(255, 111, 97, 0.15);
}
</style>

<template>
  <section class="panel stat-panel">
    <h2 class="panel-title">📊 学习数据统计</h2>

    <!-- 汇总卡片 -->
    <div class="stat-summary">
      <div class="stat-card">
        <span class="stat-label">本周累计专注</span>
        <span class="stat-value">{{ stat.summary.weekTotal }}<em> 分钟</em></span>
      </div>
      <div class="stat-card">
        <span class="stat-label">本月累计专注</span>
        <span class="stat-value">{{ stat.summary.monthTotal }}<em> 分钟</em></span>
      </div>
      <div class="stat-card">
        <span class="stat-label">打卡天数</span>
        <span class="stat-value">{{ clockDays }}<em> 天</em></span>
      </div>
    </div>

    <p v-if="stat.loading" class="tip">统计数据加载中…</p>

    <!-- 近 7 天柱状图 -->
    <div class="chart-block">
      <h3 class="chart-title">近 7 天专注时长（分钟）</h3>
      <div ref="weekEl" class="chart"></div>
    </div>

    <!-- 近 30 天折线图 -->
    <div class="chart-block">
      <h3 class="chart-title">近 30 天专注时长趋势（分钟）</h3>
      <div ref="monthEl" class="chart"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([BarChart, LineChart, GridComponent, TooltipComponent, CanvasRenderer])
import { useStat } from '../composables/useStat'
import { getStorage, STORAGE_KEYS } from '../utils/storage'

const props = defineProps({
  refreshTick: { type: Number, default: 0 }
})

const stat = reactive(useStat())
const weekEl = ref(null)
const monthEl = ref(null)
let weekChart = null
let monthChart = null

const clockDays = computed(() => {
  const list = getStorage(STORAGE_KEYS.CLOCK_LIST, [])
  return Array.isArray(list) ? list.length : 0
})

const AXIS_COLOR = '#8a8f98'
const GRID = { left: 8, right: 16, top: 24, bottom: 8, containLabel: true }

function baseOption() {
  return {
    grid: GRID,
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: [],
      axisLabel: { color: AXIS_COLOR, fontSize: 11 },
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { color: AXIS_COLOR, fontSize: 11 },
      splitLine: { lineStyle: { color: '#eef0f2' } }
    }
  }
}

function renderWeek() {
  const dates = stat.weekStat.map((s) => s.date.slice(5))
  const values = stat.weekStat.map((s) => s.studyTime)
  weekChart.setOption({
    ...baseOption(),
    xAxis: { ...baseOption().xAxis, data: dates },
    series: [
      {
        type: 'bar',
        data: values,
        barWidth: '55%',
        itemStyle: { color: '#ff6f61', borderRadius: [6, 6, 0, 0] },
        label: { show: true, position: 'top', color: '#ff6f61', fontSize: 11 }
      }
    ]
  })
}

function renderMonth() {
  const dates = stat.monthStat.map((s) => s.date.slice(5))
  const values = stat.monthStat.map((s) => s.studyTime)
  monthChart.setOption({
    ...baseOption(),
    xAxis: { ...baseOption().xAxis, data: dates },
    series: [
      {
        type: 'line',
        data: values,
        smooth: true,
        symbolSize: 5,
        lineStyle: { color: '#43a047', width: 2.5 },
        itemStyle: { color: '#43a047' },
        areaStyle: { color: 'rgba(67, 160, 71, 0.12)' }
      }
    ]
  })
}

function renderCharts() {
  if (!weekChart || !monthChart) return
  renderWeek()
  renderMonth()
}

function onResize() {
  weekChart?.resize()
  monthChart?.resize()
}

onMounted(async () => {
  await stat.loadStats()
  weekChart = echarts.init(weekEl.value)
  monthChart = echarts.init(monthEl.value)
  renderCharts()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  weekChart?.dispose()
  monthChart?.dispose()
})

watch(() => props.refreshTick, () => stat.loadStats())
watch(() => [stat.weekStat, stat.monthStat], renderCharts)
</script>

<style scoped>
.stat-summary {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.stat-card {
  flex: 1;
  min-width: 120px;
  background: var(--bg-soft);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.stat-label {
  font-size: 12px;
  color: var(--text-dim);
}
.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: var(--primary);
  font-variant-numeric: tabular-nums;
}
.stat-value em {
  font-style: normal;
  font-size: 13px;
  color: var(--text-dim);
  font-weight: 400;
}
.chart-block {
  margin-bottom: 18px;
}
.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
}
.chart {
  width: 100%;
  height: 240px;
}
.tip {
  font-size: 12px;
  color: var(--text-dim);
  margin-bottom: 8px;
}
</style>

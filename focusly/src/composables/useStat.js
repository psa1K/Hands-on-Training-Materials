/**
 * 数据可视化统计看板模块
 *
 * - 聚合近 7 天 / 近 30 天专注时长
 * - 汇总本周 / 本月累计时长
 * - 供 ECharts 图表使用，数据源变更后重新加载即可自动刷新
 */

import { ref } from 'vue'
import { fetchWeekStat, fetchMonthStat, fetchSummary } from '../api/stat'

export function useStat() {
  const weekStat = ref([])
  const monthStat = ref([])
  const summary = ref({ weekTotal: 0, monthTotal: 0 })
  const loading = ref(false)

  async function loadStats() {
    loading.value = true
    try {
      const [week, month, sum] = await Promise.all([fetchWeekStat(), fetchMonthStat(), fetchSummary()])
      weekStat.value = week
      monthStat.value = month
      summary.value = sum
    } finally {
      loading.value = false
    }
  }

  return { weekStat, monthStat, summary, loading, loadStats }
}

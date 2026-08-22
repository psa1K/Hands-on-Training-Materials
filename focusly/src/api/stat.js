/**
 * 数据统计接口
 * GET /stat/week   获取近7天学习统计数据
 * GET /stat/month  获取近30天学习统计数据
 */

import request from './request'
import { getStorage, STORAGE_KEYS } from '../utils/storage'
import { recentDays, formatDate } from '../utils/date'

/** 由本地打卡记录聚合出统计数组（date 从旧到新，无记录补 0） */
function aggregateFromLocal(days) {
  const records = getStorage(STORAGE_KEYS.CLOCK_LIST, [])
  const map = {}
  records.forEach((r) => {
    map[r.date] = Number(r.studyTime) || 0
  })
  return days.map((date) => ({ date, studyTime: map[date] || 0 }))
}

function validateStat(data, days) {
  if (!Array.isArray(data) || data.length !== days.length) {
    throw new Error('统计数据不完整')
  }
  return days.map((date, i) => ({
    date,
    studyTime: Number(data[i]?.studyTime) || 0
  }))
}

/** 获取近7天统计 */
export async function fetchWeekStat() {
  const days = recentDays(7)
  try {
    const data = await request.get('/stat/week')
    return validateStat(data, days)
  } catch (e) {
    return aggregateFromLocal(days)
  }
}

/** 获取近30天统计 */
export async function fetchMonthStat() {
  const days = recentDays(30)
  try {
    const data = await request.get('/stat/month')
    return validateStat(data, days)
  } catch (e) {
    return aggregateFromLocal(days)
  }
}

/** 汇总统计：本周/本月累计专注时长（基于本地与接口一致） */
export async function fetchSummary() {
  const week = await fetchWeekStat()
  const month = await fetchMonthStat()
  const weekTotal = week.reduce((s, x) => s + x.studyTime, 0)
  const monthTotal = month.reduce((s, x) => s + x.studyTime, 0)
  return { weekTotal, monthTotal }
}

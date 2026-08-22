/**
 * 日期工具
 */

/** 返回 YYYY-MM-DD */
export function formatDate(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** 返回 YYYY-MM-DDTHH:mm:ss.000Z（ISO 时间，createTime 用） */
export function formatDateTime(d = new Date()) {
  return d.toISOString()
}

/** 今天的 YYYY-MM-DD */
export function today() {
  return formatDate(new Date())
}

/** 日期字符串 + 天数偏移 */
export function addDays(dateStr, offset) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + offset)
  return formatDate(d)
}

/** 生成最近 n 天日期数组（从旧到新），格式 YYYY-MM-DD */
export function recentDays(n) {
  const arr = []
  for (let i = n - 1; i >= 0; i--) {
    arr.push(addDays(today(), -i))
  }
  return arr
}

/** 毫秒 -> "HH:MM:SS" */
export function formatClock(ms) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (v) => String(v).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

/** 分钟数 -> "x小时x分钟" */
export function formatMinutes(min) {
  const m = Math.floor(min)
  if (m < 60) return `${m} 分钟`
  const h = Math.floor(m / 60)
  const rest = m % 60
  return rest === 0 ? `${h} 小时` : `${h} 小时 ${rest} 分钟`
}

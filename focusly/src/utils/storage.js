/**
 * LocalStorage 工具类
 *
 * 提供安全读写、JSON 解析容错，作为 Mock API 的离线兜底数据源。
 * 所有业务数据的本地缓存统一走这里，保证读写安全、无数据丢失。
 */

const PREFIX = 'focusly_'

export const STORAGE_KEYS = {
  TIMER_CONFIG: 'timer_config',
  TASK_LIST: 'task_list',
  CLOCK_LIST: 'clock_list'
}

/** 内存型数据（当日专注时长累计，按日期分桶） */
export const MEMORY_KEYS = {
  TODAY_STUDY: 'today_study_ms'
}

export function getStorage(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null || raw === undefined) return defaultValue
    return JSON.parse(raw)
  } catch (e) {
    return defaultValue
  }
}

export function setStorage(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch (e) {
    return false
  }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch (e) {
    /* 忽略 */
  }
}

/**
 * 同步本地数据到 Mock 服务（网络恢复后的补传逻辑，当前为留接口）
 * 说明：普通 Apifox Mock 为静态数据，此方法保留用于未来对接真实后端。
 */
export async function syncToRemote(fn, payload) {
  try {
    const res = await fn(payload)
    return res
  } catch (e) {
    return null
  }
}

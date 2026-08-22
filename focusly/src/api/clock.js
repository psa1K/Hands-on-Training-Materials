/**
 * 每日学习打卡接口
 * GET  /clock/list  获取全部打卡记录
 * POST /clock/add   提交当日学习打卡
 */

import request from './request'
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage'

/** 获取全部打卡记录 */
export async function fetchClockList() {
  try {
    const data = await request.get('/clock/list')
    if (Array.isArray(data)) {
      setStorage(STORAGE_KEYS.CLOCK_LIST, data)
      return data
    }
    throw new Error('打卡记录格式异常')
  } catch (e) {
    return getStorage(STORAGE_KEYS.CLOCK_LIST, [])
  }
}

/** 提交当日学习打卡，返回 { ok, msg, record } */
export async function addClock(record) {
  try {
    const data = await request.post('/clock/add', record)
    return { ok: true, msg: '今日打卡成功', record: data || record }
  } catch (e) {
    // Mock 可能返回重复打卡等业务错误，但本地仍需落库
    setStorage(STORAGE_KEYS.CLOCK_LIST, mergeClockRecord(record))
    return { ok: false, msg: e.message || '打卡失败', record }
  }
}

/** 本地合并打卡记录（保证同一日期唯一） */
function mergeClockRecord(record) {
  const list = getStorage(STORAGE_KEYS.CLOCK_LIST, [])
  const idx = list.findIndex((r) => r.date === record.date)
  if (idx >= 0) {
    list[idx] = record
  } else {
    list.push(record)
  }
  return list
}

/**
 * 计时器配置接口
 * GET  /timer/config  获取默认计时配置
 * PUT  /timer/config  保存自定义计时配置
 */

import request from './request'
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage'

const DEFAULT_CONFIG = { studyDuration: 25, restDuration: 5 }

/** 获取计时器配置（Mock 优先，失败回退本地） */
export async function fetchTimerConfig() {
  try {
    const data = await request.get('/timer/config')
    if (data && typeof data.studyDuration === 'number') {
      setStorage(STORAGE_KEYS.TIMER_CONFIG, data)
      return data
    }
    throw new Error('配置格式异常')
  } catch (e) {
    const local = getStorage(STORAGE_KEYS.TIMER_CONFIG, DEFAULT_CONFIG)
    return { ...DEFAULT_CONFIG, ...local }
  }
}

/** 保存计时器配置 */
export async function saveTimerConfig(config) {
  try {
    const data = await request.put('/timer/config', config)
    setStorage(STORAGE_KEYS.TIMER_CONFIG, data)
    return data
  } catch (e) {
    setStorage(STORAGE_KEYS.TIMER_CONFIG, config)
    return config
  }
}

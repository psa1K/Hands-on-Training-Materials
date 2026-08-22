/**
 * 统一请求封装
 *
 * - 基于 Axios 封装通用请求工具类
 * - 统一返回格式 { code, msg, data }
 * - code === 200 视为成功，否则抛出携带 msg 的错误
 * - 网络异常 / 超时 / Mock 服务不可用时抛出 ApiOfflineError，交由上层降级为 LocalStorage
 */

import axios from 'axios'

export class ApiOfflineError extends Error {
  constructor(msg = '接口服务不可用') {
    super(msg)
    this.name = 'ApiOfflineError'
  }
}

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 3000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器：统一处理 loading 计数等可在此扩展
request.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// 响应拦截器：解包统一响应结构
request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res && typeof res === 'object' && 'code' in res) {
      if (res.code === 200) {
        return res.data
      }
      return Promise.reject(new Error(res.msg || '请求失败'))
    }
    // 非标准结构也视为离线（Mock 未按约定返回）
    return Promise.reject(new ApiOfflineError('接口响应格式不符合约定'))
  },
  (error) => {
    // 网络错误、超时、CORS 等 -> 离线兜底
    return Promise.reject(new ApiOfflineError('接口请求失败，已切换本地数据'))
  }
)

export default request

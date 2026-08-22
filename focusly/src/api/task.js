/**
 * 学习任务接口
 * GET    /task/list       获取任务列表
 * POST   /task/add        新增学习任务
 * PUT    /task/update     更新任务状态/内容
 * DELETE /task/delete?id= 删除单条任务
 */

import request from './request'
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage'

/** 获取任务列表 */
export async function fetchTaskList() {
  try {
    const data = await request.get('/task/list')
    if (Array.isArray(data)) {
      setStorage(STORAGE_KEYS.TASK_LIST, data)
      return data
    }
    throw new Error('任务列表格式异常')
  } catch (e) {
    return getStorage(STORAGE_KEYS.TASK_LIST, [])
  }
}

/** 新增学习任务 */
export async function addTask(task) {
  try {
    const data = await request.post('/task/add', task)
    return data || task
  } catch (e) {
    return task
  }
}

/** 更新任务（状态/内容），发送完整任务对象 */
export async function updateTask(task) {
  try {
    const data = await request.put('/task/update', task)
    return data || task
  } catch (e) {
    return task
  }
}

/** 删除单条任务，id 放在 Query 参数中 */
export async function deleteTask(id) {
  try {
    await request.delete('/task/delete', { params: { id } })
    return true
  } catch (e) {
    return true
  }
}

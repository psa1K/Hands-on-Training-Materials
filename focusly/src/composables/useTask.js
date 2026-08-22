/**
 * 学习任务清单模块
 *
 * - 增删改查、状态切换（0 未完成 / 1 已完成）
 * - Mock API 优先交互，LocalStorage 本地持久化兜底
 * - 所有变更同步写回本地缓存，刷新不丢失
 */

import { ref } from 'vue'
import { fetchTaskList, addTask as apiAddTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask } from '../api/task'
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage'
import { formatDateTime } from '../utils/date'

export function useTask() {
  const tasks = ref([])
  const loading = ref(false)

  function persist() {
    setStorage(STORAGE_KEYS.TASK_LIST, tasks.value)
  }

  async function loadTasks() {
    loading.value = true
    try {
      const list = await fetchTaskList()
      // 本地已有数据则以本地为准（保证新增/删除不被 Mock 静态数据覆盖）
      const local = getStorage(STORAGE_KEYS.TASK_LIST, null)
      tasks.value = Array.isArray(local) ? local : list
      if (tasks.value.length === 0) persist()
    } finally {
      loading.value = false
    }
  }

  /** 新增任务，禁止空任务 */
  async function addTask(content, description = '') {
    const text = String(content || '').trim()
    if (!text) return { ok: false, msg: '任务内容不能为空' }
    if (text.length > 60) return { ok: false, msg: '任务内容最多 60 字符' }
    if (String(description || '').trim().length > 160) return { ok: false, msg: '任务描述最多 160 字符' }

    const task = {
      id: String(Date.now()),
      content: text,
      description: String(description || '').trim(),
      status: '0',
      createTime: formatDateTime()
    }
    tasks.value.unshift(task)
    persist()
    apiAddTask(task) // Mock 交互（不阻塞本地）
    return { ok: true, msg: '任务添加成功', task }
  }

  /** 切换完成状态 */
  async function toggleStatus(task) {
    task.status = task.status === '1' ? '0' : '1'
    persist()
    apiUpdateTask(task)
  }

  /** 编辑任务内容 */
  async function editTask(task, { content, description }) {
    const text = String(content || '').trim()
    if (!text) return { ok: false, msg: '任务内容不能为空' }
    if (text.length > 60) return { ok: false, msg: '任务内容最多 60 字符' }
    if (String(description || '').trim().length > 160) return { ok: false, msg: '任务描述最多 160 字符' }
    task.content = text
    task.description = String(description || '').trim()
    persist()
    apiUpdateTask(task)
    return { ok: true, msg: '任务已更新' }
  }

  /** 删除单条任务 */
  async function removeTask(id) {
    const idx = tasks.value.findIndex((t) => t.id === id)
    if (idx < 0) return
    tasks.value.splice(idx, 1)
    persist()
    apiDeleteTask(id)
  }

  /** 一键清空所有任务（每个任务单独调用一次删除接口） */
  async function clearTasks() {
    const ids = tasks.value.map((t) => t.id)
    tasks.value = []
    persist()
    ids.forEach((id) => apiDeleteTask(id))
  }

  return { tasks, loading, loadTasks, addTask, toggleStatus, editTask, removeTask, clearTasks }
}

<template>
  <section class="panel task-panel">
    <h2 class="panel-title">📋 学习任务清单</h2>

    <!-- 新增任务 -->
    <form class="task-form" @submit.prevent="handleAdd">
      <input
        v-model.trim="newContent"
        class="task-input"
        type="text"
        placeholder="添加学习任务，如：阅读论文第三章"
        maxlength="60"
      />
      <input
        v-model.trim="newDesc"
        class="task-input small"
        type="text"
        placeholder="任务描述（可选）"
        maxlength="160"
      />
      <button class="btn primary" type="submit" :disabled="!newContent">添加</button>
    </form>

    <p v-if="msg" class="tip">{{ msg }}</p>
    <p v-if="task.loading.value" class="tip">加载中…</p>

    <!-- 任务列表 -->
    <ul v-if="task.tasks.value.length" class="task-list">
      <li v-for="t in task.tasks.value" :key="t.id" class="task-item" :class="{ done: t.status === '1' }">
        <label class="task-check" :title="t.status === '1' ? '标记未完成' : '标记完成'">
          <input type="checkbox" :checked="t.status === '1'" @change="onToggle(t)" />
          <span class="checkmark"></span>
        </label>

        <div class="task-body" v-if="editingId !== t.id" @dblclick="startEdit(t)">
          <p class="task-content">{{ t.content }}</p>
          <p v-if="t.description" class="task-desc">{{ t.description }}</p>
        </div>

        <form class="task-edit" v-else @submit.prevent="submitEdit(t)">
          <input v-model.trim="editContent" class="task-input" type="text" maxlength="60" />
          <input v-model.trim="editDesc" class="task-input small" type="text" maxlength="160" />
          <div class="task-edit-actions">
            <button class="btn primary small" type="submit">保存</button>
            <button class="btn small" type="button" @click="cancelEdit">取消</button>
          </div>
        </form>

        <div class="task-actions" v-if="editingId !== t.id">
          <button class="icon-btn" title="编辑" @click="startEdit(t)">✏️</button>
          <button class="icon-btn" title="删除" @click="onRemove(t.id)">🗑️</button>
        </div>
      </li>
    </ul>

    <p v-else-if="!task.loading.value" class="empty">暂无任务，添加一个开始专注吧 ✨</p>

    <!-- 清空 -->
    <div v-if="task.tasks.value.length" class="task-toolbar">
      <span class="count">共 {{ task.tasks.value.length }} 项</span>
      <button class="btn outline small" @click="onClear">一键清空</button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTask } from '../composables/useTask'

const task = useTask()

const newContent = ref('')
const newDesc = ref('')
const msg = ref('')
const editingId = ref(null)
const editContent = ref('')
const editDesc = ref('')

onMounted(() => task.loadTasks())

function flash(text) {
  msg.value = text
  setTimeout(() => (msg.value = ''), 2500)
}

async function handleAdd() {
  const res = await task.addTask(newContent.value, newDesc.value)
  flash(res.msg)
  if (res.ok) {
    newContent.value = ''
    newDesc.value = ''
  }
}

async function onToggle(t) {
  await task.toggleStatus(t)
}

async function onRemove(id) {
  await task.removeTask(id)
}

async function onClear() {
  if (!window.confirm('确定清空所有任务吗？')) return
  await task.clearTasks()
}

function startEdit(t) {
  editingId.value = t.id
  editContent.value = t.content
  editDesc.value = t.description || ''
}

function cancelEdit() {
  editingId.value = null
}

async function submitEdit(t) {
  const res = await task.editTask(t, { content: editContent.value, description: editDesc.value })
  flash(res.msg)
  if (res.ok) editingId.value = null
}
</script>

<style scoped>
.task-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}
.task-input {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  background: #fff;
  outline: none;
  transition: border-color 0.2s;
}
.task-input.small {
  padding: 7px 12px;
  font-size: 13px;
}
.task-input:focus {
  border-color: var(--primary);
}
.tip {
  font-size: 12px;
  color: var(--primary);
  margin-bottom: 8px;
}
.task-list {
  list-style: none;
  max-height: 320px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.task-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: var(--bg-soft);
  border-radius: 12px;
  padding: 10px 12px;
  transition: background 0.2s, transform 0.15s;
}
.task-item:hover {
  transform: translateX(2px);
}
.task-item.done .task-content {
  color: var(--text-dim);
  text-decoration: line-through;
}
.task-check {
  position: relative;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
  cursor: pointer;
}
.task-check input {
  position: absolute;
  opacity: 0;
}
.checkmark {
  position: absolute;
  inset: 0;
  border: 2px solid var(--border);
  border-radius: 6px;
  background: #fff;
  transition: all 0.2s;
}
.task-check input:checked + .checkmark {
  background: var(--primary);
  border-color: var(--primary);
}
.task-check input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}
.task-body {
  flex: 1;
  cursor: pointer;
}
.task-content {
  font-size: 14px;
  color: var(--text);
  word-break: break-all;
}
.task-desc {
  font-size: 12px;
  color: var(--text-dim);
  margin-top: 2px;
  word-break: break-all;
}
.task-edit {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.task-edit-actions {
  display: flex;
  gap: 8px;
}
.task-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}
.icon-btn {
  border: none;
  background: transparent;
  font-size: 15px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s, transform 0.15s;
  padding: 2px;
}
.icon-btn:hover {
  opacity: 1;
  transform: scale(1.15);
}
.task-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}
.count {
  font-size: 13px;
  color: var(--text-dim);
}
.empty {
  text-align: center;
  color: var(--text-dim);
  font-size: 14px;
  padding: 24px 0;
}
</style>

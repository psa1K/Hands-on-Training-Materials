<template>
  <div class="app">
    <header class="app-header">
      <h1 class="logo">🍅 Focusly <span>番茄时钟</span></h1>
      <p class="subtitle">专注 · 任务 · 打卡 · 复盘</p>
    </header>

    <main class="app-main">
      <!-- 核心计时区 -->
      <TimerPanel @changed="refreshStats" />

      <!-- 任务 + 打卡区 -->
      <section class="grid-2">
        <TaskPanel />
        <ClockPanel @clocked="refreshStats" />
      </section>

      <!-- 底部统计区 -->
      <StatPanel :refresh-tick="refreshTick" />
    </main>

    <footer class="app-footer">
      Focusly 番茄时钟 · AI Coding 实训项目 · Mock API + LocalStorage 双数据源
    </footer>

    <div id="timer-toast" class="timer-toast"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TimerPanel from './components/TimerPanel.vue'
import TaskPanel from './components/TaskPanel.vue'
import ClockPanel from './components/ClockPanel.vue'
import StatPanel from './components/StatPanel.vue'

const refreshTick = ref(0)

function refreshStats() {
  refreshTick.value++
}
</script>

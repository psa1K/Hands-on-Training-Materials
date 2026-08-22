# 🍅 Focusly 番茄时钟 - 专注学习打卡工具

一个轻量化、极简风格的单页 Web 应用（SPA），集 **番茄专注计时、学习任务管理、每日学习打卡、学习数据可视化统计** 于一体的学生自用学习工具。

采用 **Mock API 模拟后端接口为核心数据源、LocalStorage 为离线兜底** 的工程化双层数据方案，无需真实后端即可体验标准前后端交互开发模式。

## ✨ 功能特性

### 🍅 番茄专注计时（核心）
- 可视化 SVG 倒计时表盘，实时展示时分秒
- 学习 / 休息双模式切换，自动衔接
- 自定义学习（1-180 分钟）与休息（1-60 分钟）时长，非法输入自动容错
- 开始 / 暂停 / 重置，计时结束自动文字提醒
- 时间戳差值计算防时间漂移，单定时器管理防叠加与内存泄漏
- 学习时长实时累计为"当日专注时长"

### 📋 学习任务清单
- 任务增删改查，双击即可编辑
- 完成 / 未完成状态一键切换，已完成自动置灰 + 划线
- 单条删除与一键清空，本地持久化不丢失

### ✅ 每日学习打卡
- 每日一次打卡，记录日期与当日专注总时长
- 同一日期重复打卡自动拦截提示
- 月度日历展示，已打卡日期高亮标识

### 📊 数据统计看板
- 本周 / 本月累计专注时长汇总卡片
- 近 7 天柱状图、近 30 天折线图（ECharts）
- 数据变更后图表自动刷新，无需手动操作

## 🛠 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Vue 3（Composition API） |
| 构建 | Vite |
| 网络请求 | Axios（统一封装请求工具类） |
| 可视化 | ECharts（按需引入，控制包体积） |
| 数据源 | Apifox Mock API + LocalStorage 双层方案 |

## 📂 项目结构

```
focusly/
├── index.html
├── vite.config.js
├── package.json
├── .env                      # 可配置 Apifox Mock 地址
├── src/
│   ├── main.js               # 应用入口
│   ├── App.vue               # 主布局与数据装配
│   ├── api/                  # 接口层（RESTful）
│   │   ├── request.js        # Axios 统一封装（响应解包/异常降级）
│   │   ├── timer.js          # 计时器配置接口
│   │   ├── task.js           # 学习任务接口
│   │   ├── clock.js          # 学习打卡接口
│   │   └── stat.js           # 数据统计接口
│   ├── composables/          # 业务逻辑（组合式函数）
│   │   ├── useTimer.js       # 番茄计时
│   │   ├── useTask.js        # 任务清单
│   │   ├── useClock.js       # 每日打卡
│   │   └── useStat.js        # 数据统计
│   ├── components/           # 页面组件
│   │   ├── TimerPanel.vue    # 计时面板
│   │   ├── TaskPanel.vue     # 任务面板
│   │   ├── ClockPanel.vue    # 打卡面板
│   │   └── StatPanel.vue     # 统计面板
│   ├── utils/
│   │   ├── storage.js        # LocalStorage 工具
│   │   └── date.js           # 日期工具
│   └── styles/
│       └── main.css          # 全局样式（响应式）
```

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

## 🔌 对接 Apifox Mock（可选）

项目默认使用 LocalStorage（离线兜底模式），无需任何配置即可运行。

如需体验标准 RESTful 交互，在 Apifox 中按文档创建好接口与 Mock 环境后，编辑项目根目录 `.env`：

```env
VITE_API_BASE_URL=https://你的Apifox-Mock地址/api
VITE_API_TIMEOUT=3000
```

修改后重启开发服务器。接口遵循统一返回格式 `{ code, msg, data }`，`code === 200` 视为成功；网络异常、超时、Mock 服务不可用时自动降级为 LocalStorage，保证功能可用。

### 接口清单

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/timer/config | 获取计时器配置 |
| PUT | /api/timer/config | 保存计时器配置 |
| GET | /api/task/list | 获取任务列表 |
| POST | /api/task/add | 新增学习任务 |
| PUT | /api/task/update | 更新任务状态/内容 |
| DELETE | /api/task/delete?id= | 删除单条任务 |
| GET | /api/clock/list | 获取打卡记录 |
| POST | /api/clock/add | 提交今日打卡 |
| GET | /api/stat/week | 近 7 天统计 |
| GET | /api/stat/month | 近 30 天统计 |

## 🧪 逻辑验证

- `npm run build` 构建通过
- 日期工具与存储/统计聚合逻辑均有单元冒烟测试（13 项日期 + 7 项存储统计）

## 📄 文档

- [《Focusly番茄时钟-专注学习打卡工具》需求说明书](../《Focusly番茄时钟-专注学习打卡工具》需求说明书.md)
- [Focusly番茄时钟-专注学习API接口与数据模型.docx](../Focusly番茄时钟-专注学习API接口与数据模型.docx)

## 📝 说明

本项目为前端实训 AI Coding 项目，使用 AI 辅助编程完成编码、调试与优化。Apifox 用于模拟标准前后端接口交互，LocalStorage 负责浏览器侧持久化与离线兜底。

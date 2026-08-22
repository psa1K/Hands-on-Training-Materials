# AI Coding 提示词记录

> 本文件用于记录 AI Coding 作业中与 AI 助手对话所使用的提示词（Prompt）。
> 记录时间、提示词原文、AI 执行结果与产出物，便于复盘与提交作业。

---

## 2026-08-22 会话记录

### Prompt 1：Fork 远程仓库

- **时间**：2026-08-22
- **提示词原文**：

> 我需要完成本周的ai coding 作业，我需要你fork一个仓库 https://github.com/sinkingwen/Hands-on-Training-Materials，并记录我对你的提示词储存在一个文件中，本地文件在~/projects下新建一个文件夹进行

- **目的**：Fork 课程资料仓库，创建本地工作目录，并建立提示词记录文件。
- **执行结果**：
  - 已 fork 至 `psa1K/Hands-on-Training-Materials`
  - 本地目录：`~/projects/Hands-on-Training-Materials`
  - 已配置 `origin`（fork 仓库）与 `upstream`（原仓库）
  - 本文件（提示词记录）已创建
- **产出物**：本地仓库、本提示词记录文件

---

### Prompt 2：安装 Apifox CLI

- **时间**：2026-08-22
- **提示词原文**：

> 阅读说明并帮我安装 Apifox CLI：https://apifox.com/apifox-cli-installation-guide.md

- **目的**：按官方引导安装 Apifox CLI，用于后续接口管理与自动化测试。
- **执行结果**：
  - 已安装 `apifox-cli@2.2.9`（npm 全局，官方源安装成功，镜像源超时）
  - 已登录账号：kei2332@qq.com（ID 3809193）
  - 已手动安装 8 份 Apifox AI Agent Skills 至 `~/.config/opencode/skills/`（apifox-cli、test-case、test-automation、test-scenario、branch、cli-checkup、import-export、workflow-api-lifecycle），因官方交互式安装器无法非交互执行
  - 已在项目内创建 `.apifox/settings.json`（含 `projectId` 占位）与 `.apifox/.gitignore`
  - `apifox whoami` / `apifox project list` 验证通过
- **产出物**：Apifox CLI 登录就绪、8 个 Agent Skills、`.apifox` 目录配置

### Prompt 3：完成 Focusly 番茄时钟项目

- **时间**：2026-08-22
- **提示词原文**：

> 请阅读《Focusly番茄时钟-专注学习打卡工具》需求说明书.md与Focusly番茄时钟-专注学习API接口与数据模型.docx并完成项目

- **目的**：依据需求文档与 API/数据模型文档，从零实现完整可运行的 Focusly 番茄钟前端项目。
- **执行结果**：
  - 技术栈：Vue3（Composition API）+ Vite + Axios + ECharts（按需引入）
  - 项目位置：`focusly/`，实现四大模块：
    - 番茄专注计时：SVG 表盘、学习/休息模式切换、自定义时长校验、开始/暂停/重置、时间戳差值防漂移、单定时器防叠加、结束后文字提醒、学习时长实时累计
    - 学习任务清单：增删改查、状态切换（置灰+划线）、一键清空、60/160 字符校验、本地持久化
    - 每日学习打卡：每日一次、重复拦截、今日专注分钟数、月度日历高亮
    - 数据统计看板：本周/本月汇总卡片、近 7 天柱状图、近 30 天折线图、数据变更自动刷新
  - 双数据源：Axios 封装统一响应（code/msg/data），网络失败自动降级 LocalStorage；`.env` 可配置 Apifox Mock 地址
  - 质量验证：`npm run build` 通过（ECharts 按需引入后包体积 1.17MB → 618KB）；13 项日期逻辑测试 + 7 项存储/统计测试全部通过；dev 服务器与全部模块编译验证通过
- **产出物**：`focusly/` 完整 Vue3 前端工程源码（可 `npm install && npm run dev` 运行）

---

## 待续

后续提示词将追加记录于本文件。

# 贡献指南

感谢你对 GoodAction Hub 的关注与贡献！本指南用于帮助你高效、规范地参与项目。

## 行为准则

- 尊重与包容：请在 Issues、PR 与讨论中保持友善沟通
- 信息准确：提交的活动或美食指南信息应尽量标注来源与时间

## 如何贡献

### 1. 新增或修正活动数据

- 文件位置：`data/conferences.yml`、`data/competitions.yml`、`data/activities.yml`
- 参考 README 中的「数据结构」小节填写条目
- 线上活动地点请写 `线上`，并尽可能标注时间、链接与时区

### 2. 无障碍友好美食指南

- 页面路径：`/Barrier-Free-Bites`（注意大小写）
- 欢迎补充餐厅的无障碍设施信息、导航提示或志愿者体验

### 3. 提交代码变更

1. Fork 仓库并创建特性分支：`feat/...` 或 `fix/...`
2. 安装依赖并启动：`bun install && bun dev`
3. 通过 `bun run lint` 确认无 ESLint 错误（已配置 pre-commit 钩子）
4. 编写清晰的提交信息（中文或英文均可）
5. 发起 Pull Request，描述修改内容与动机

## 开发与测试

- 包管理器与运行时：Bun
- 框架：Next.js，UI：Tailwind CSS / shadcn/ui
- 本地访问：`http://localhost:3000`

## 部署建议

- Netlify：已集成 `@netlify/plugin-nextjs`，构建命令 `npm run build`
- 如遇到 404 或路由大小写问题：
  - 使用规范路径访问：`/Barrier-Free-Bites`
  - 在 Netlify 后台 “Clear cache and deploy site” 并检查构建日志

## 问题反馈

- 使用 Issues 反馈问题或提出建议
- 在 Discussions 分享数据来源、部署经验与无障碍建议

期待你的贡献，一起让公益与无障碍信息更易获取！
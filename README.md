# GoodAction Hub公益慈善生活平台

GoodAction Hub 是一个聚合公益活动信息与无障碍餐饮指南的开源站点，包含两大模块：

[![CI & CD][1]][2]

[![Open in GitHub Codespaces][3]][4]
[![Open in Gitpod][5]][6]

- 公益慈善活动截止日期（路径：`/deadlines`）：基于 [hust-open-atom-club/open-source-deadlines][7] 改造与扩展，汇总会议、竞赛与活动的关键时间节点，帮助公益从业者、志愿者和爱心人士不再错过参与机会。
- 无障碍友好美食指南（路径：`/Barrier-Free-Bites`）：原创功能模块，聚焦无障碍就餐体验与友好餐饮空间，提供更易获取的线索与导航入口（路径大小写需一致）。

## 模块来源说明

为便于理解项目结构与来源，现对两大模块的来源说明如下：

- 公益慈善活动截止日期（改造自开源项目）
  - 基于 [hust-open-atom-club/open-source-deadlines][7] 改造开发
  - 我们的改动：
    - 🎯 主题转换：从开源技术活动切换为公益慈善活动
    - 🎨 UI 增强：视觉与交互优化
    - 📊 数据适配：统一数据模型，适配公益活动特点
  - 致谢：感谢原项目团队的开源贡献与优秀架构

- 无障碍友好美食指南（原创模块）
  - 路径：`/Barrier-Free-Bites`
  - 目标：提升餐饮空间的无障碍友好度信息的可获得性
  - 内容：餐厅无障碍设施线索、就餐体验与导航建议
  - 注意：请使用大小写一致的路径以避免托管平台的大小写路由差异

## 核心功能

- 公益慈善活动截止日期（路径：`/deadlines`）
  - 汇总公益会议、竞赛与活动的关键时间节点，支持时区展示与人类可读日期
  - 提供「日历添加」与「倒计时」等便捷功能（组件参考：`components/AddToCalendar.tsx`、`components/CountdownTimer.tsx`、`components/TimelineItem.tsx`）
  - 活动数据由独立数据仓库统一维护并提供

- 无障碍友好美食指南（路径：`/Barrier-Free-Bites`）
  - 聚焦无障碍就餐体验与友好餐饮空间，提供更易获取的线索与导航入口
  - 建议使用「大小写一致」的路径访问：`/Barrier-Free-Bites`（注意大小写），以保证在不同托管平台上的最佳路由兼容性

## 数据贡献指引

我们非常欢迎社区贡献。活动数据与无障碍友好美食数据现已统一迁移到独立数据仓库维护，请在以下仓库提交与更新：

- https://github.com/GoodAction-Hub/GoodAction-data

适用范围：

- 新增或修正公益活动（会议、竞赛、活动）信息
- 新增或修正无障碍友好美食地信息
- 补充无障碍要素、来源链接与说明

提交方式：

- 在数据仓库发起 Pull Request
- 或在数据仓库提交 Issue，由维护者协助跟进

如对本仓库页面结构或展示逻辑有改进建议，欢迎在本仓库继续提交 PR 或在 Discussions 讨论。

💡 **新手友好提示**：如果您不熟悉 Pull Request 流程，也可以通过 Discussions 和 Issues 提交信息，我们来协助整理。

> 🎉 **每一份贡献都很珍贵，欢迎您的参与！**

## 开发指南

### 环境准备

**Bun**: 本项目使用 [Bun][8] 作为包管理器和运行时。

### 本地启动

1. **克隆项目**

   ```bash
   git clone <your-repository-url>
   cd GoodAction-Hub
   ```

2. **安装依赖**

   ```bash
   bun install
   ```

3. **激活 Git Hook（此步骤会在安装依赖后自动执行）**

   ```bash
   bun run prepare
   ```

4. **启动开发服务器**

   ```bash
   bun run dev
   ```

5. **（可选）剪枝**

   ```bash
   bun run knip
   ```

现在，在浏览器中打开 http://localhost:3000 即可看到项目页面。

### 部署与运维

- 推荐平台：Netlify（已集成 `@netlify/plugin-nextjs`）
  - 构建命令：`npm run build`
  - 如遇到路由大小写或缓存相关问题，建议在 Netlify 后台执行 “Clear cache and deploy site” 重新构建
- 也可选择 GitHub Pages 或华为云部署（参考仓库根目录的相关文档与脚本）

### 反馈与支持

- 提交 Issue：用于报告 bug 或提出功能建议
- 发起讨论：欢迎在 Discussions 分享使用体验与数据来源
- 路由与无障碍建议：如发现路径大小写或页面访问问题，请附上平台与链接便于排查

### 技术栈

- **框架**: [Next.js][9]
- **UI**: [Tailwind CSS][10] & [shadcn/ui][11]
- **状态管理**: [Zustand][12]
- **搜索**: [Fuse.js][13]

[1]: https://github.com/GoodAction-Hub/GoodAction-Hub.github.io/actions/workflows/deploy.yml/badge.svg
[2]: https://github.com/GoodAction-Hub/GoodAction-Hub.github.io/actions/workflows/deploy.yml
[3]: https://github.com/codespaces/badge.svg
[4]: https://codespaces.new/GoodAction-Hub/GoodAction-Hub.github.io
[5]: https://gitpod.io/button/open-in-gitpod.svg
[6]: https://gitpod.io/?autostart=true#https://github.com/GoodAction-Hub/GoodAction-Hub.github.io
[7]: https://github.com/hust-open-atom-club/open-source-deadlines
[8]: https://bun.sh/
[9]: https://nextjs.org/
[10]: https://tailwindcss.com/
[11]: https://ui.shadcn.com/
[12]: https://github.com/pmndrs/zustand
[13]: https://github.com/krisk/fuse

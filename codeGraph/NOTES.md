# Teaching Notes — CodeGraph

## Content Rules（通用规则，OpenMontage 与 CodeGraph 均适用）
- 课程开头放 GitHub Trending / Stars 等社交证明横幅，吸引眼球
- 不设"下一课"按钮/链接 — 课程一篇一篇学，不误导导航
- 禁止交互式/AI 助手口吻 — 不能出现"告诉我""有疑问问我"等表述
- 突出项目卖点 — GitHub 排名、Star 数等社交证明必须在显眼位置
- CSS 全部内联到 HTML 文件中，不依赖外部样式表。每个课程文件完全自包含。
- 图表用 div + CSS 绘制，不用 ASCII art 或 pre 标签画图。
- 不使用 JavaScript。测验交互用 SVG animate（begin="click" + restart="never"）实现点击显示答案。

## User Preferences
- 中文教学，技术术语保留英文（如 AST、MCP、symbol、call graph）
- 学习风格：先原理后实践，理论与实践结合
- 每个课程约 10 分钟阅读量，内容精炼不废话
- 课后不要放"有问题向 AI 提问"模块
- 不要加"金句总结"或"关键洞察"之类的升华模块（如"Extract 把文本变成..."、"代码的拓扑结构..."）

## Session Log
- 2026-06-24: 初始化 CodeGraph 学习工作区。用户明确目标为 colbymchenry/codegraph，先原理后实践。
- 2026-06-24: 完成第 1 课（什么是 CodeGraph），创建架构参考文档。验证内容基于 GitHub README 和 CHANGELOG（v1.1.0, 2026-06-23）。
- 2026-06-27: 创建第 1 课 HTML 文件（金色手账风），更新 GLOSSARY.md 充实术语表，创建 learning-record 0002。确认后续 3 课计划：安装配置 / MCP 集成 / 进阶实践。

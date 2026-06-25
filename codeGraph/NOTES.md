# Teaching Notes — CodeGraph

## User Preferences
- 中文教学，技术术语保留英文（如 AST、MCP、symbol、call graph）
- 学习风格：先原理后实践，理论与实践结合
- 每个课程约 10 分钟阅读量，内容精炼不废话
- 课后不要放"有问题向 AI 提问"模块
- 不要加"金句总结"或"关键洞察"之类的升华模块（如"Extract 把文本变成..."、"代码的拓扑结构..."）
- **CSS 全部内联到 HTML 文件中，不依赖外部样式表。每个课程文件完全自包含。**
- **图表用 div + CSS 绘制，不用 ASCII art 或 pre 标签画图。**
- **不使用 JavaScript。测验交互用 SVG animate（begin="click" + restart="never"）实现点击显示答案，兼容微信公众号。**

## Session Log
- 2026-06-24: 初始化 CodeGraph 学习工作区。用户明确目标为 colbymchenry/codegraph，先原理后实践。
- 2026-06-24: 完成第 1 课（什么是 CodeGraph），创建架构参考文档。验证内容基于 GitHub README 和 CHANGELOG（v1.1.0, 2026-06-23）。

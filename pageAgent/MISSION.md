# Mission: Alibaba Page Agent

## Why
学习如何用 Page Agent 给自己的网页产品加上 AI 助手功能。这个项目一行脚本就能让网页听懂人话、自动操作 DOM，不需要做浏览器插件、不需要搞后端服务、不需要喂截图给 AI——说白了，就是最低成本给自己的网页加上一个"AI 大脑"。

## Success looks like
- 能说清楚 Page Agent 是干什么的、什么场景下用它
- 会用 CDN 一行脚本在自己的网页上接入 Page Agent
- 能从 NPM 引入并配置 `new PageAgent()`，调用 `execute()` 完成自动化操作
- 理解它的工作原理：DOM 文本化 + LLM 决策 + DOM 操作，不需要多模态模型

## Constraints
- 公众号文章形式发布，面向中文开发者
- 保持口语化风格，不能有 AI 味

## Out of scope
- 深入 LLM 模型选型对比
- 自己训练或微调模型
- Chrome 扩展开发细节
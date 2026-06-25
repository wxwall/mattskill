# Mission: CodeGraph

## Why
我想让 AI 编程助手（Claude Code、Cursor 等）更好地理解我的代码库。CodeGraph 通过构建代码知识图谱，让 AI Agent 用更少的 token、更少的工具调用来理解代码结构，从而提升开发效率。我要先理解它的工作原理，然后在我的实际项目中落地使用。

## Success looks like
- 能解释 CodeGraph 的核心原理：AST 解析 → 符号提取 → 图构建 → 语义搜索 → MCP 服务
- 能在自己的项目中安装、配置、运行 CodeGraph
- 能在 Claude Code 中通过 MCP 集成 CodeGraph，感受到 token 消耗减少
- 能根据项目特点调整 CodeGraph 配置，获得最佳效果

## Constraints
- 学习时间：业余时间，每次学习一个短课程即可
- 语言偏好：中文教学，但技术术语保留英文
- 最终目标项目：全栈项目（TypeScript/Python/Go）

## Out of scope
- 不深入 Rust/C++ 原生扩展开发
- 不修改 CodeGraph 源码做二次开发（除非后续有兴趣）
- 不涉及其他代码图谱工具（如 ops-codegraph-tool、GraphScope），聚焦 colbymchenry/codegraph

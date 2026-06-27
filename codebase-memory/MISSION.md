# Mission: codebase-memory-mcp

## Why
我想让 AI 编程助手更高效地理解代码库。codebase-memory-mcp 是一个高性能代码智能 MCP Server，用 tree-sitter 构建知识图谱，158 种语言，单个静态二进制，号称比 CodeGraph 更快更全。我要理解它的工作原理，并在项目中落地使用。

## Success looks like
- 能解释 codebase-memory-mcp 的核心原理：tree-sitter → RAM-first 流水线 → 知识图谱 → MCP
- 能在自己的项目中安装、配置、运行 codebase-memory-mcp
- 能通过 MCP 集成到 Claude Code，感受 token 消耗减少
- 能使用 14 个 MCP 工具中的核心工具（search_graph、trace_path、query_graph 等）
- 能比较 codebase-memory-mcp 与 CodeGraph 的异同和适用场景

## Constraints
- 学习时间：业余时间，每次一个短课程即可
- 语言偏好：中文教学，技术术语保留英文
- 已有 CodeGraph 基础，可做对比教学

## Out of scope
- 不深入 tree-sitter 语法编写
- 不修改源码做二次开发

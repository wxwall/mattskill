# codebase-memory-mcp Glossary

## 核心概念

| 术语 | 定义 |
|------|------|
| codebase-memory-mcp | 高性能代码智能 MCP Server，用 tree-sitter 构建知识图谱，158 种语言 |
| RAM-first Pipeline | 内存优先处理流水线，用 LZ4 压缩，在内存 SQLite 中构建图结构 |
| Knowledge Graph | 代码中函数、类、调用链、HTTP 路由、跨服务链接构成的知识图谱 |
| Hybrid LSP | 混合语义解析，对 8 种语言做类型级语义解析（Python/TS/JS/PHP/C#/Go/C++/Java/Kotlin/Rust） |

## MCP 工具

| 工具 | 用途 |
|------|------|
| index_repository | 索引整个仓库 |
| list_projects | 列出已索引的项目 |
| delete_project | 删除项目索引 |
| index_status | 检查索引状态 |
| search_graph | 图搜索，按名称/模式查找符号 |
| trace_path | 追踪调用路径 |
| query_graph | Cypher-like 图查询语言 |
| get_graph_schema | 获取图结构 schema |
| get_code_snippet | 获取代码片段 |
| get_architecture | 获取项目架构概览 |
| search_code | 全文搜索代码 |
| detect_changes | 检测文件变更 |
| manage_adr | 管理架构决策记录（ADR） |
| ingest_traces | 摄入可观测性 trace 数据 |

## 技术特性

| 术语 | 定义 |
|------|------|
| 158 Languages | 编译了 158 种 tree-sitter 语法到单个静态二进制中 |
| Sub-ms Queries | 结构化查询响应时间低于 1 毫秒 |
| Single Static Binary | 单个静态二进制文件，零依赖，无需 Docker 或运行时 |

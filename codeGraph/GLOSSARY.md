# CodeGraph Glossary

CodeGraph 生态系统的核心术语表。术语将在学习过程中逐步添加。

## 基础概念

| 术语 | 英文 | 定义 |
|------|------|------|
| 知识图谱 | Knowledge Graph | 代码中符号（节点）及其关系（边）构成的有向图结构 |
| 节点 | Node | 代码中的可识别实体：函数、类、方法、接口、常量、路由处理器等 |
| 边 | Edge | 节点之间的关系：calls、imports、extends、implements、routes、bridges |
| 符号 | Symbol | 代码中可被引用的命名实体，与 Node 基本同义 |
| 调用图 | Call Graph | 函数之间调用关系构成的有向图 |
| 继承链 | Inheritance Chain | 类之间的 extends/implements 关系链 |

## 技术组件

| 术语 | 英文 | 定义 |
|------|------|------|
| AST | Abstract Syntax Tree | 抽象语法树，tree-sitter 解析源码的结构化输出 |
| tree-sitter | tree-sitter | 增量语法解析器，CodeGraph 用于从源码提取符号和关系 |
| FTS5 | Full-Text Search 5 | SQLite 的全文搜索扩展，支持快速模糊搜索 |
| SQLite | SQLite | 嵌入式数据库，CodeGraph 用于存储节点、边和文件索引 |
| MCP | Model Context Protocol | 开放的模型上下文协议，AI Agent 与工具之间的标准通信协议 |
| MCP Server | MCP Server | 实现 MCP 协议的服务端，CodeGraph 通过它暴露代码知识图谱 |

## 流水线

| 术语 | 定义 |
|------|------|
| Extract | 阶段 1：tree-sitter 解析源码提取符号和关系 |
| Store | 阶段 2：将提取结果写入 SQLite 数据库 |
| Resolve | 阶段 3：解析符号引用、构建调用图、框架路由映射 |
| Serve | 阶段 4：通过 MCP Server 向 AI Agent 提供查询服务 |

## MCP 工具

| 工具 | 用途 |
|------|------|
| codegraph_explore | 主工具：一次查询获取入口点 + 相关符号 + 调用流 + 影响范围 |
| codegraph_node | 获取单个符号的详细信息 |
| codegraph_search | 全文搜索整个代码库 |
| codegraph_callers | 查询谁调用了某个符号 |
| codegraph_callees | 查询某个符号调用了谁 |
| codegraph_impact | 变更影响分析：修改某个符号会影响哪些代码 |
| codegraph_files | 列出项目中已索引的文件 |
| codegraph_status | 检查索引状态 |

## Benchmark 指标

| 指标 | 数值 | 含义 |
|------|------|------|
| Token 节省 | 47% | AI Agent 消耗的 token 减少近一半 |
| 工具调用减少 | 58% | Agent 不再需要多次文件读取和搜索 |
| 响应加速 | 22% | Agent 回答问题速度提升 |
| 成本降低 | 16% | API 调用成本降低 |

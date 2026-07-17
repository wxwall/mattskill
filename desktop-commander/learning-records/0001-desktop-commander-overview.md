# 了解 Desktop Commander MCP 开源项目

## What
学习了 wonderwhy-er/DesktopCommanderMCP 这个 8.2K+ Stars 的开源 MCP 服务器项目。核心理解：
- Desktop Commander 是一个 MCP 服务器，让 AI 助手（Claude、GPT 等）获得终端控制、文件系统和进程管理能力
- 支持 20+ 客户端：Claude Desktop、Cursor、Windsurf、VS Code、ChatGPT、Gemini CLI 等
- 安装方式：npx（推荐，自动更新）、Docker（最安全，完全隔离）、手动配置
- 文件格式支持：Excel、PDF、DOCX 原生读写，无需安装 Office
- Remote MCP 功能：从 ChatGPT/Claude 网页版远程控制电脑
- 安全机制：命令黑名单、目录白名单、Docker 隔离、审计日志

## Implications
这个项目展示了 MCP 协议的实际应用场景。后续可以深入讲解如何配置安全策略、如何使用 Remote MCP 功能，或者对比其他 MCP 服务器（如 Playwright MCP、Filesystem MCP）。
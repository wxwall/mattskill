# Codex Plugin — 第 1 课完成

## 2026-07-10

通过 openai/codex-plugin-cc 开源项目（GitHub 27.2K+ Stars），学习了 OpenAI 官方出品的 Claude Code 插件。课程已完成第 1 课：《Codex Plugin 是什么？》并发布为公众号草稿。

## 关键内容
- Codex Plugin 是 OpenAI 官方开源的 Claude Code 插件，让 Claude Code 和 Codex 协作
- 8 个核心斜杠命令：review / adversarial-review / rescue / transfer / status / result / cancel / setup
- 安装流程：插件市场添加 → 安装 → 重载 → setup 验证
- 三个典型工作流：代码审查接力、bug 排查接力、安全审查
- Review Gate 机制：自动门禁审查，但可能消耗额度
- 模型选择：spark 轻量快速 vs full model 高力度推理

## Implications for future sessions
- 后续可以深入 Review Gate 的配置和实战
- 可以对比 Claude Code 原生能力和 Codex 插件能力的差异
- 可以结合项目展示实际工作流
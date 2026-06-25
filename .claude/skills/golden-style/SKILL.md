---
name: golden-style
description: Generate WeChat Official Account compatible HTML pages from tutorial articles using a warm journal/notebook aesthetic (golden-brown color palette). Use when user provides a Chinese tutorial article and wants it formatted as a WeChat-ready HTML page, or mentions "金色风格", "手账风", "公众号", or "微信排版".
---

# 金色风格 (Golden Journal Style)

将教程文章生成为微信公众号兼容的 HTML 页面，手账笔记本风格，暖棕金色系。

## 硬约束（违反任何一个微信都会出问题）

1. **只用 inline style** — 无 `<style>` 标签、无外部 CSS
2. **无 JavaScript** — 微信全部过滤
3. **文字紧贴标签** — `<div>文字</div>` 不能写成 `<div>\n文字\n</div>`（换行会被转为 `&nbsp;` 缩进）
4. **不用 `<p>` 标签** — 微信自动给 `<p>` 加首行缩进空格，改用 `<div>`
5. **不用 `<details>`** — 微信不支持，用 SVG + `<animate begin="click">` 做点击展开
6. **不用 `box-shadow`、`position:fixed/sticky`** — 微信会过滤
7. **外层容器左右 padding 为 0** — 微信公众号自己会加边距
8. **所有颜色用暖棕金色系** — 禁止红绿蓝紫，用茶色/麦色替代

## 快速流程

1. 读文章 → 梳理小节标题、内容类型、测验题目
2. 识别内容模式：正文段落、代码命令、对比场景、便利贴重点、测验 Q&A
3. 按模板逐节输出 HTML，文字始终紧贴标签
4. 测验选项按文字行数选择 SVG 高度（单行 52 / 双行 68 / 三行 88 px）
5. 输出完整单行 HTML 文件

## 关键规则

- **配色只用暖色系**：正反馈用金麦色 `#f5f0e0` 而非绿色，负反馈用茶色 `#faf5f0` 而非红色
- **SVG 测验**：每个选项一个 SVG，`<tspan leaf="">` 包裹文字，两组 `<g>` + `<animate begin="click">` 切换 opacity
- **不使用 `<br>` 做段落间距**：用 `margin-bottom` 控制
- **代码块**：深棕底 `#3d2b1f` + 浅米字 `#e8dcc8`

完整配色表、组件模板、SVG 尺寸速查见 [REFERENCE.md](REFERENCE.md)。

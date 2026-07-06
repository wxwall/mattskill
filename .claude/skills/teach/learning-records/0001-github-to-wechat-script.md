---
name: github-to-wechat-script
description: 创建了 github-to-wechat.js 脚本，将 GitHub 仓库到公众号文章的全流程自动化
metadata:
  type: project
---

创建了 `github-to-wechat.js` 脚本，固化从 GitHub 仓库到公众号文章的全流程：

1. 通过 GitHub API 获取仓库信息（Star、Fork、License、语言等）
2. 创建课程目录结构
3. 生成 golden-style 封面 SVG + Edge headless 截图 + PIL 转 JPEG
4. 生成带统计卡片、章节、SVG 测验的文章 HTML
5. 自动调用 `wechat-publish.js` 发布到公众号

**Why:** 之前为 lingbot-map 手动走了一遍流程，过程重复性高，适合脚本化。后续遇到类似需求只需一条命令。

**How to apply:** `node github-to-wechat.js <repo-url> [合集名]`。首次为某个项目生成文章时使用，后续续写课程内容仍需手动编辑 lessons/ 下的 HTML。

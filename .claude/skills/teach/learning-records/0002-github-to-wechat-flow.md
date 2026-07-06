---
name: github-to-wechat
description: GitHub 仓库信息获取、封面生成、文章写作、公众号发布全自动流程（已集成 teach 规则）
---

当用户给一个 GitHub 仓库链接要求"写成文章发到公众号"，通过 `/teach` skill 执行以下流程：

## 流程（全自动，按顺序执行）

### 1. 获取仓库信息
- 调用 `curl -sL "https://api.github.com/repos/{owner}/{repo}"` 获取仓库 JSON
- 获取关键字段：`stargazers_count`、`forks_count`、`description`、`language`、`license`、`topics`、`html_url`
- 通过 API `repos/{owner}/{repo}/readme` 获取 README 内容（base64 解码）
- 通过 API `repos/{owner}/{repo}/releases/latest` 获取最新版本号

### 2. 创建课程目录
- 在项目根目录创建 `{repoName}/` 课程目录
- 子目录：`lessons/`、`reference/`、`assets/`、`learning-records/`
- 后续如果用户想继续学习，再补充 `MISSION.md` 和 `RESOURCES.md`

### 3. 生成封面 SVG
- viewBox="0 0 1175 500"，golden-style 配色
- 包含：版本标签、项目名、副标题、描述、Star/Fork/License/语言 统计卡片
- 保存到 `{repoName}/lessons/cover.svg`

### 4. 封面截图 SVG → PNG → JPEG
- Edge headless 截图：`msedge.exe --headless --screenshot="cover.png" --window-size=1175,500 "file:///cover.svg"`
- PIL 转 JPEG：`Image.open('cover.png').convert('RGB').save('cover.jpg', 'JPEG', quality=95)`

### 5. 生成文章 HTML（遵循 teach skill 的公众号规则）
- golden-style 暖棕金色系（#f5f0e8 背景，#3d2b1f 标题，#8b6914 副标题）
- 全文 inline-style，不使用 `<style>` 标签，不使用 JavaScript，不使用 GIF
- 封面图在正文开头：`<img src="cover.jpg">`
- 封面已包含社交证明信息，正文中不重复显示统计横幅
- 不设"下一课"导航，不使用 AI 助手口吻
- 口语化写作风格
- SVG animate 格式测验两题
- 以 `<img src="cover.jpg">` 开头的正文区（无笔记本头部）

### 6. 发布到公众号
- 执行 `node ./wechat-publish.js {htmlFilePath} "合集名" 0`
- 合集名从用户参数获取，默认为"其他"

## 课程目录结构（遵循 teach skill 规范）
```
项目根目录/{repoName}/
├── MISSION.md            # 后续手动补充
├── RESOURCES.md           # 后续手动补充
├── NOTES.md               # 后续手动补充
├── reference/             # 参考文档
├── assets/                # 可复用组件
├── learning-records/      # 学习记录
└── lessons/
    ├── cover.svg          # 封面源文件
    ├── cover.png          # 封面截图中间产物
    ├── cover.jpg          # 最终封面（公众号可上传）
    └── 0001-what-is-{repo}.html  # 正式文章
```

## 注意
- `github-to-wechat.js` 脚本是独立的 Node.js 自动化入口，但通过 `/teach` 调用的流程由我直接执行，不走该脚本
- 每完成一条发布，写入一条 learning-record
- `cover.png` 是中间产物，可保留不清理

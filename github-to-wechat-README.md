# GitHub → 公众号文章 自动化流水线

一键将 GitHub 仓库转换为公众号文章并自动发布。

## 用法

```bash
node github-to-wechat.js <GitHub仓库URL> [合集名]
```

## 示例

```bash
# 发布到 "AI" 合集
node github-to-wechat.js https://github.com/Robbyant/lingbot-map "AI"

# 发布到 "其他" 合集（默认）
node github-to-wechat.js https://github.com/user/repo
```

## 流程

1. 读取 GitHub 仓库信息（API）
2. 创建课程目录结构 `repoName/lessons/`
3. 生成封面 SVG → Edge headless 截图 → PIL 转 JPEG
4. 生成 golden-style 文章 HTML（含测验、统计卡片）
5. 自动发布到公众号

## 依赖

- Node.js 18+
- Microsoft Edge（用于封面截图）
- Python + PIL（用于封面格式转换）
- 公众号发布脚本 `wechat-publish.js`

## 输出

```
repoName/
├── lessons/
│   ├── cover.svg       # 封面源文件
│   ├── cover.png       # 截图中间产物
│   ├── cover.jpg       # 最终封面（可上传公众号后台）
│   └── 0001-what-is-<repo>.html  # 文章
```

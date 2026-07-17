# CLAUDE.md

## 公众号文章发布规则

生成完 HTML 文章文件后，**必须立即自动调用发布脚本**，不需要等我再下一道指令。

发布命令：
```
node ./wechat-publish.js ./课程目录/lessons/文章.html "合集名"
```

示例：生成 `./strix/lessons/0001-xxx.html` 后自动执行
`node ./wechat-publish.js ./strix/lessons/0001-xxx.html "其他"`

## 封面图样式规则

封面图 `<img src="cover.jpg">` 必须使用以下样式，**禁止使用负边距**：
```
style="display:block;width:100%;height:auto;border-radius:0;margin:0;max-width:100%"
```

- 禁止 `margin:0 -8px`（会导致微信编辑器排版错位，图片偏移到最左边）
- 禁止 `max-width:none`（会导致图片超出正文区域）

## 手机端图片规则

文章中所有图片必须保证手机端可读，遵循以下规则：

1. **字体大小**：图片内文字在 1500px 宽度下，标题 ≥ 40px，正文 ≥ 32px，小标签 ≥ 26px
2. **命令代码不上图片**：命令行代码、配置命令等文本必须放在 HTML `<code>` 或代码块中，不能嵌入图片
3. **多图内容**：连续有多个框/卡片的部分（如痛点列表、功能对比），做成图片，公众号偏好多图内容
4. **图片宽度**：内容图片统一 1500px 宽，高度根据内容自动计算

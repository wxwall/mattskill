# CLAUDE.md

## 公众号文章发布规则

生成完 HTML 文章文件后，**必须立即自动调用发布脚本**，不需要等我再下一道指令。

发布命令：
```
node ./wechat-publish.js ./课程目录/lessons/文章.html "合集名"
```

示例：生成 `./strix/lessons/0001-xxx.html` 后自动执行
`node ./wechat-publish.js ./strix/lessons/0001-xxx.html "其他"`

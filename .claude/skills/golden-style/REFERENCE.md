# 金色风格 — 完整参考

## 配色表

### 基础色

| 角色 | 色值 | 用途 |
|------|------|------|
| 纸张底色 | `#f5f0e8` | body 背景 |
| 头部底色 | `#fbf7f0` | 页头背景 |
| 白色卡片 | `#fff` | 内容卡片 |
| 深棕文字 | `#3d2b1f` | 主标题 |
| 中棕文字 | `#5c4033` | 正文 |
| 浅棕文字 | `#8b7355` | 辅助说明 |
| 金色强调 | `#8b6914` | 小节编号、重点标题 |
| 浅金装饰 | `#c4a97d` | 分隔线、装订孔 |
| 边框色 | `#e8dcc8` | 卡片边框 |
| 虚线色 | `#d4c4a8` | 标题下虚线分隔 |

### 反馈色（替代红/绿）

| 角色 | 底色 | 边框色 | 文字色 | 深色变体 |
|------|------|--------|--------|----------|
| 错误/负面 | `#faf5f0` | `#d4bfb0` | `#7d5f52` | `#5c3d30` |
| 正确/正面 | `#f5f0e0` | `#c4b89a` | `#6b5a30` | `#4a3d1e` |
| 便利贴重点 | `#f5f0e3` | `#d4c8b0` | `#6b5a30` | 左边条 `#b8956a` |

### 特殊色

| 角色 | 色值 | 用途 |
|------|------|------|
| inline code 背景 | `#e0d5c0` | 行内代码高亮 |
| 便利贴左边条 | `#b8956a` | 铜金色竖条 |
| 代码块底色 | `#3d2b1f` | 暗底代码块 |
| 代码块文字 | `#e8dcc8` | 暗底上浅色字 |

### 禁止使用的颜色

红 `#c62828` `#dc2626` `#e65100` | 绿 `#2e7d32` `#16a34a` `#166534` | 蓝 `#1976d2` `#0d47a1` | 紫 `#7b1fa2` `#4a148c` | 黄 `#f57f17` `#fff9c4` `#ffe082`

---

## 字体规格

| 角色 | 字体栈 | 大小 | 粗细 |
|------|--------|------|------|
| 正文 | `-apple-system,BlinkMacSystemFont,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif` | 13-14px | 400 |
| 衬线编号 | `'Georgia','Noto Serif SC',serif` | 22px | 700 |
| 代码 | `'SF Mono',Menlo,monospace` | 10-12px | 400 |
| 小节标题 | 同上正文 | 16px | 700 |
| 辅助文字 | 同上正文 | 10-11px | 400 |
| 行高 | — | 1.8-2.0 | — |

---

## 页面骨架

```
body: margin:0;padding:0;background:#f5f0e8;text-indent:0;line-height:1.8
└── 头部 div: background:#fbf7f0;padding:28px 0 24px;text-align:center
    ├── 装订孔: 三个8px圆点 #c4a97d
    ├── 课程标签: border圆角标签
    ├── 大标题: 26px 深棕/金色
    └── 元信息: 12px 浅棕
└── 正文 div: padding:8px 0
    ├── [每节]
    │   ├── 标题行: Georgia编号22px金色 + 16px深棕标题 + 虚线分隔
    │   └── 内容区
    ├── [测验]
    │   ├── 标题: 📝 + 16px深棕 + 金线分隔
    │   └── SVG选项 × 4
    └── [结语]
        ├── 📒 + 完成信息
        └── 下一课按钮: 金色边框圆角

└── 页脚 div: text-align:center;padding:0 0 24px
    └── 参考资料 9px 浅金
```

---

## 组件模板

### 小节标题

```html
<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:14px">
<span style="font-family:'Georgia','Noto Serif SC',serif;font-size:22px;font-weight:700;color:#8b6914">01</span>
<span style="font-size:16px;font-weight:700;color:#3d2b1f">小节标题</span>
<span style="flex:1;border-bottom:1px dotted #d4c4a8;margin-bottom:3px"></span>
</div>
```

### 正文段落

```html
<div style="text-indent:0;margin:0 0 14px;font-size:13px;color:#5c4033;line-height:1.9">
正文内容<b>加粗重点</b>继续文字。
</div>
```

### 代码块（暗底）

```html
<div style="background:#3d2b1f;color:#e8dcc8;padding:12px 16px;border-radius:6px;font-family:'SF Mono',Menlo,monospace;font-size:12px;text-align:center;margin-bottom:14px">
codegraph install
</div>
```

### 便利贴重点

```html
<div style="background:#f5f0e3;border:1px solid #d4c8b0;border-radius:2px 8px 8px 2px;padding:14px;margin-top:14px;position:relative">
<div style="position:absolute;top:-1px;left:-1px;bottom:-1px;width:4px;background:#b8956a;border-radius:2px 0 0 2px"></div>
<div style="font-size:11px;font-weight:700;color:#8b6914;margin-bottom:4px">📌 标题</div>
<div style="font-size:12px;color:#5c4033;line-height:1.8">重点内容<b>加粗</b>。</div>
</div>
```

### 错误/负面卡片

```html
<div style="border:2px solid #d4bfb0;border-radius:10px;overflow:hidden">
<div style="background:#f7f0ed;padding:10px 14px;font-size:12px;font-weight:700;color:#7d5f52">❌ 标题</div>
<div style="padding:12px 14px;background:#faf5f0;font-size:11px;color:#8b7355;line-height:2">内容</div>
</div>
```

### 正确/正面卡片

```html
<div style="border:2px solid #c4b89a;border-radius:10px;overflow:hidden">
<div style="background:#f5f0e0;padding:10px 14px;font-size:12px;font-weight:700;color:#6b5a30">✅ 标题</div>
<div style="padding:12px 14px;background:#faf7ed;font-size:11px;color:#8b7355;line-height:2">内容</div>
</div>
```

### 暗色代码对比卡片（用于无CodeGraph vs 有CodeGraph）

```html
<!-- 无CodeGraph -->
<div style="border:2px solid #d4bfb0;border-radius:10px;overflow:hidden">
<div style="background:#f7f0ed;padding:8px 14px;font-size:11px;font-weight:700;color:#7d5f52">❌ 没有 CodeGraph</div>
<div style="padding:10px 14px;background:#faf5f0;font-family:'SF Mono',Menlo,monospace;font-size:10px;color:#7d5f52;line-height:2.2">命令内容</div>
</div>

<!-- 有CodeGraph -->
<div style="border:2px solid #c4b89a;border-radius:10px;overflow:hidden">
<div style="background:#f5f0e0;padding:8px 14px;font-size:11px;font-weight:700;color:#6b5a30">✅ 使用 CodeGraph</div>
<div style="padding:10px 14px;background:#faf7ed;font-family:'SF Mono',Menlo,monospace;font-size:10px;color:#6b5a30;line-height:2.2">命令内容</div>
</div>
```

### 行内代码

```html
<span style="font-family:'SF Mono',Menlo,monospace;background:#e0d5c0;padding:1px 5px;border-radius:2px;font-size:10px">code</span>
```

---

## 测验 SVG 模板

### 尺寸速查

| 答案行数 | viewBox | SVG height | rect height | 文字 y 坐标 |
|----------|---------|------------|-------------|------------|
| 1 行 | `0 0 350 52` | 52px | 44 | y=27 |
| 2 行 | `0 0 350 68` | 68px | 60 | y=20, y=44 |
| 3 行 | `0 0 350 88` | 88px | 80 | y=22, y=46, y=70 |

### 错误选项模板（单行为例）

```html
<svg style="display:block;width:100%;height:52px;margin-bottom:5px" viewBox="0 0 350 52" role="img">
<g>
<rect width="350" height="44" rx="6" fill="#fbf7f0" stroke="#e8dcc8" stroke-width="1"></rect>
<text x="12" y="27" fill="#8b7355" font-size="13"><tspan leaf="">A. 选项文字</tspan></text>
<animate attributeName="opacity" begin="click" restart="never" to="0" dur="0.01s" fill="freeze"></animate>
</g>
<g opacity="0">
<rect width="350" height="44" rx="6" fill="#faf5f0" stroke="#d4bfb0" stroke-width="1"></rect>
<text x="12" y="27" fill="#7d5f52" font-size="13" font-weight="bold"><tspan leaf="">✗ A. 不对。解释文字。</tspan></text>
<animate attributeName="opacity" begin="click" restart="never" to="1" dur="0.01s" fill="freeze"></animate>
</g>
</svg>
```

### 正确选项模板（双行为例）

```html
<svg style="display:block;width:100%;height:68px;margin-bottom:5px" viewBox="0 0 350 68" role="img">
<g>
<rect width="350" height="60" rx="6" fill="#fbf7f0" stroke="#e8dcc8" stroke-width="1"></rect>
<text x="12" y="20" fill="#8b7355" font-size="13"><tspan leaf="">B. 选项文字第一行</tspan></text>
<text x="12" y="44" fill="#8b7355" font-size="13"><tspan leaf="">选项文字第二行</tspan></text>
<animate attributeName="opacity" begin="click" restart="never" to="0" dur="0.01s" fill="freeze"></animate>
</g>
<g opacity="0">
<rect width="350" height="60" rx="6" fill="#f5f0e0" stroke="#c4b89a" stroke-width="1"></rect>
<text x="12" y="20" fill="#6b5a30" font-size="13" font-weight="bold"><tspan leaf="">✓ B. 正确！解释第一行。</tspan></text>
<text x="12" y="44" fill="#6b5a30" font-size="13" font-weight="bold"><tspan leaf="">解释第二行。</tspan></text>
<animate attributeName="opacity" begin="click" restart="never" to="1" dur="0.01s" fill="freeze"></animate>
</g>
</svg>
```

### 空占位行（选项文字仅一行但需要双行高度时）

```html
<text x="12" y="44" fill="#8b7355" font-size="13"><tspan leaf=""></tspan></text>
```

---

## 页面结语模板

```html
<div style="text-align:center;padding:20px 0 32px">
<div style="font-size:28px;margin-bottom:6px">📒</div>
<div style="font-size:14px;font-weight:700;color:#3d2b1f;margin-bottom:4px">第 X 课 · 笔记完成</div>
<div style="font-size:11px;color:#8b7355;margin-bottom:18px;line-height:1.8">课程要点总结</div>
<div style="display:inline-block;border:2px solid #8b6914;padding:10px 24px;border-radius:24px">
<span style="font-size:12px;font-weight:600;color:#8b6914">▶ 第 X+1 课：下一课标题</span>
<span style="display:block;font-size:9px;color:#c4a97d;margin-top:2px">副标题</span>
</div>
</div>
```

---

## 内容模式识别

读文章时，根据以下特征选择对应组件：

| 文章特征 | 使用组件 |
|----------|----------|
| `第 X 课 · XXX` | 页面头部 |
| `问题 X` / `Q X` / 小测验 | 测验 SVG |
| `✓ 正确` / `✗ 不对` | 测验反馈色 |
| `📌` | 便利贴重点 |
| 代码命令（curl/npm/git） | 暗底代码块 |
| `❌ xxx` vs `✅ xxx` | 对比卡片（错误/正确） |
| 百分比数据 | 统计卡片（暖色数字） |
| 分步骤流程 | 箭头/竖线连接的流程卡片 |
| `建议` / `注意` / `⚠️` | 便利贴（羊皮纸底） |
| N-E-G 三要素 | 三色节点卡片（金/茶/麦） |

"""Generate images with MOBILE-FRIENDLY fonts. Command code removed from images."""
from PIL import Image, ImageDraw, ImageFont

OUT = 'D:/github/mattskill/skills/lessons'
yahei = 'C:/Windows/Fonts/msyh.ttc'
yahei_bold = 'C:/Windows/Fonts/msyhbd.ttc'
consola = 'C:/Windows/Fonts/consola.ttf'

def f(name, size):
    return ImageFont.truetype(name, size)

# ========== IMG 1: 4 PROBLEMS ==========
# At 1500px, phone shows at ~375px = 25% scale.
# For 14px effective on phone, need 56px in image. Let's use 60px for body.
W2 = 1500
problems = [
    ("🤷", "Agent 不听话", "你让它干 A，它干了 B", "沟通错位", "Grill 模式", "用 /grill-me 先对齐需求再动手"),
    ("💬", "Agent 话太多", "一个简单问题写三大段", "缺乏共享语言", "CONTEXT.md", "建术语表，让 Agent 用 1 个词代替 20 个字"),
    ("💥", "代码跑不起来", "写完一跑就报错", "缺少反馈闭环", "TDD + 诊断", "先写测试再写代码，出 bug 走诊断流程"),
    ("🧱", "代码变成屎山", "改一处炸三处", "缺乏架构意识", "架构优化", "定期跑 improve-codebase-architecture 保持整洁"),
]
card_w = (W2 - 80) // 2
card_h = 380
gap = 30
title_h = 110
pad_t = 50
pad_b = 50
img_h = pad_t + title_h + 20 + card_h * 2 + gap + pad_b
img2 = Image.new('RGB', (W2, int(img_h)), (245, 240, 232))
d2 = ImageDraw.Draw(img2)

d2.text((W2//2, pad_t + title_h//2), 'AI 编程的 4 大痛点 · Matt Pocock 的解决方案', fill=(61, 43, 31), font=f(yahei_bold, 56), anchor='mm')

for idx, (icon, title, problem, cause, fix_name, fix_desc) in enumerate(problems):
    col = idx % 2
    row = idx // 2
    x = 20 + col * (card_w + gap)
    y = pad_t + title_h + 20 + row * (card_h + gap)

    d2.rounded_rectangle([x, y, x + card_w, y + card_h], radius=20, fill=(250, 245, 240), outline=(224, 210, 190))

    # Icon + Title
    d2.text((x + 30, y + 22), icon, font=f(yahei, 56))
    d2.text((x + 100, y + 30), title, fill=(61, 43, 31), font=f(yahei_bold, 40))

    # Problem
    d2.text((x + 30, y + 100), f'症状：{problem}', fill=(139, 105, 20), font=f(yahei, 32))

    # Cause
    d2.text((x + 30, y + 150), f'根因：{cause}', fill=(160, 120, 80), font=f(yahei, 30))

    # Separator
    d2.line([x + 30, y + 190, x + card_w - 30, y + 190], fill=(224, 210, 190), width=3)

    # Fix label
    lbl_w = 180
    d2.rounded_rectangle([x + 30, y + 210, x + 30 + lbl_w, y + 255], radius=12, fill=(139, 105, 20))
    d2.text((x + 30 + lbl_w//2, y + 232), fix_name, fill=(255, 255, 255), font=f(yahei_bold, 28), anchor='mm')

    # Fix description
    d2.text((x + 30, y + 275), fix_desc, fill=(61, 43, 31), font=f(yahei, 32))

img2.save(f'{OUT}/img-problems.png')
print('Problems image done')

# ========== IMG 2: SKILLS OVERVIEW ==========
# Split into two images: engineering + productivity
skills_eng = [
    ("⚙️ 工程技能（用户调用）", [
        ("/ask-matt", "路由器，告诉你该用哪个技能"),
        ("/grill-with-docs", "Grill + 领域建模，生成 CONTEXT.md 和 ADR"),
        ("/triage", "Issue 状态机，自动流转"),
        ("/improve-codebase-architecture", "扫描代码，出 HTML 架构报告"),
        ("/to-spec", "把对话转化为需求规格"),
        ("/to-tickets", "把需求拆成带依赖关系的工单"),
        ("/implement", "从需求到实现，驱动 TDD + 代码审查"),
        ("/wayfinder", "大项目规划，拆成调研工单逐步推进"),
    ]),
    ("⚙️ 工程技能（模型自动调用）", [
        ("/prototype", "快速原型：终端应用或 UI 变体"),
        ("/diagnosing-bugs", "复现 → 最小化 → 假设 → 修复 → 回归测试"),
        ("/research", "查资料写 Markdown 研究报告"),
        ("/tdd", "红-绿-重构 TDD 循环"),
        ("/domain-modeling", "领域建模，优化术语定义"),
        ("/codebase-design", "深层模块设计原则"),
        ("/code-review", "双轴审查：代码标准 + 规格对齐"),
    ]),
]

row_h = 76
header_h = 70
group_gap = 20
row_gap = 8
title_h2 = 110
pad_t2 = 50
pad_b2 = 50

total_h = pad_t2 + title_h2 + 20
for group_name, items in skills_eng:
    total_h += header_h + group_gap + len(items) * (row_h + row_gap)

img3 = Image.new('RGB', (W2, int(total_h) + pad_b2), (245, 240, 232))
d3 = ImageDraw.Draw(img3)

y = pad_t2
d3.text((W2//2, y + title_h2//2), '工程技能清单', fill=(61, 43, 31), font=f(yahei_bold, 56), anchor='mm')
y += title_h2 + 20

for group_name, items in skills_eng:
    d3.rounded_rectangle([20, y, W2 - 20, y + header_h], radius=10, fill=(61, 43, 31))
    d3.text((35, y + 18), group_name, fill=(255, 215, 0), font=f(yahei_bold, 30))
    y += header_h + group_gap

    for name, desc in items:
        d3.rounded_rectangle([20, y, W2 - 20, y + row_h], radius=8, fill=(250, 245, 240), outline=(224, 210, 190))
        d3.text((35, y + 18), name, fill=(139, 105, 20), font=f(consola, 26))
        d3.text((310, y + 18), desc, fill=(92, 64, 51), font=f(yahei, 26))
        y += row_h + row_gap

img3.save(f'{OUT}/img-skills-eng.png')
print('Skills eng image done')

# Productivity skills image
skills_prod = [
    ("📋 效率技能（用户调用）", [
        ("/grill-me", "深度追问，直到需求明确"),
        ("/handoff", "生成交接文档，给另一个 Agent 继续"),
        ("/teach", "多轮教学课程"),
        ("/writing-great-skills", "写技能包的参考文档"),
    ]),
    ("📋 效率技能（模型自动调用）", [
        ("/grilling", "grill-me 和 grill-with-docs 背后的可复用追问循环"),
    ]),
]

total_h2 = pad_t2 + title_h2 + 20
for group_name, items in skills_prod:
    total_h2 += header_h + group_gap + len(items) * (row_h + row_gap)

img5 = Image.new('RGB', (W2, int(total_h2) + pad_b2), (245, 240, 232))
d5 = ImageDraw.Draw(img5)

y = pad_t2
d5.text((W2//2, y + title_h2//2), '效率技能清单', fill=(61, 43, 31), font=f(yahei_bold, 56), anchor='mm')
y += title_h2 + 20

for group_name, items in skills_prod:
    d5.rounded_rectangle([20, y, W2 - 20, y + header_h], radius=10, fill=(61, 43, 31))
    d5.text((35, y + 18), group_name, fill=(255, 215, 0), font=f(yahei_bold, 30))
    y += header_h + group_gap

    for name, desc in items:
        d5.rounded_rectangle([20, y, W2 - 20, y + row_h], radius=8, fill=(250, 245, 240), outline=(224, 210, 190))
        d5.text((35, y + 18), name, fill=(139, 105, 20), font=f(consola, 26))
        d5.text((310, y + 18), desc, fill=(92, 64, 51), font=f(yahei, 26))
        y += row_h + row_gap

img5.save(f'{OUT}/img-skills-prod.png')
print('Skills prod image done')

# ========== IMG 3: INSTALL STEPS ==========
# No command code in this image - just step titles and descriptions
# Commands will be in HTML code blocks
W4 = 1500
step_h = 100
gap4 = 16
title_h4 = 110
pad_t4 = 50
pad_b4 = 50
total_h4 = pad_t4 + title_h4 + 24 + 5 * (step_h + gap4) + pad_b4
img4 = Image.new('RGB', (W4, int(total_h4)), (245, 240, 232))
d4 = ImageDraw.Draw(img4)

d4.text((W4//2, pad_t4 + title_h4//2), '安装步骤', fill=(61, 43, 31), font=f(yahei_bold, 56), anchor='mm')
y4 = pad_t4 + title_h4 + 24

steps = [
    ("1", "安装技能包", "终端执行一条命令即可安装"),
    ("2", "选择技能", "选择你想要的技能，必须选 setup-matt-pocock-skills"),
    ("3", "运行配置", "在 Agent 里运行 /setup-matt-pocock-skills"),
    ("4", "配置选项", "选择 Issue Tracker：GitHub / Linear / 本地文件"),
    ("5", "完成", "配置标签和文档位置，开始使用"),
]

for num, title, desc in steps:
    d4.rounded_rectangle([20, y4, W4 - 20, y4 + step_h], radius=14, fill=(250, 245, 240), outline=(224, 210, 190))
    # Number circle
    circle_r = 32
    d4.ellipse([35, y4 + 18, 35 + circle_r*2, y4 + 18 + circle_r*2], fill=(139, 105, 20))
    d4.text((35 + circle_r, y4 + 18 + circle_r), num, fill=(255, 255, 255), font=f(yahei_bold, 32), anchor='mm')
    # Title
    d4.text((115, y4 + 22), title, fill=(61, 43, 31), font=f(yahei_bold, 34))
    # Description
    d4.text((115, y4 + 60), desc, fill=(92, 64, 51), font=f(yahei, 28))
    y4 += step_h + gap4

img4.save(f'{OUT}/img-install.png')
print('Install image done')

print('All mobile-friendly images generated!')
"""Generate cover image for Codex Plugin lesson using Pillow."""
from PIL import Image, ImageDraw, ImageFont

W, H = 1175, 500
img = Image.new('RGB', (W, H), (245, 240, 232))
draw = ImageDraw.Draw(img)

yahei = 'C:/Windows/Fonts/msyh.ttc'
yahei_bold = 'C:/Windows/Fonts/msyhbd.ttc'
consola = 'C:/Windows/Fonts/consola.ttf'

def font(name, size):
    return ImageFont.truetype(name, size)

# Decorative lines
draw.rectangle([30, 25, 90, 27], fill=(196, 169, 125))
draw.rectangle([30, 29, 70, 31], fill=(196, 169, 125))

# Version tag
draw.rounded_rectangle([30, 46, 170, 76], radius=14, fill=(196, 169, 125, 76))
draw.text((100, 60), 'v1.0.6 · Apache 2.0', fill=(139, 105, 20), font=font(consola, 14), anchor='mm')

# Title
draw.text((55, 120), 'Codex Plugin 入门', fill=(61, 43, 31), font=font(yahei_bold, 40))
draw.text((55, 170), 'OpenAI 官方插件，让 Claude Code + Codex 联手', fill=(139, 105, 20), font=font(yahei_bold, 26))
draw.text((55, 210), 'Claude Code 插件 · 8 个斜杠命令 · 27.2K+ Stars', fill=(92, 64, 51), font=font(yahei, 15))

# Dash line
for x in range(55, 1120, 8):
    draw.rectangle([x, 234, x + 4, 235], fill=(212, 196, 168))

# Stats banner
draw.rounded_rectangle([40, 255, 1135, 355], radius=12, fill=(61, 43, 31))
gold, brown = (255, 215, 0), (196, 169, 125)

draw.text((130, 290), '27.2K+', fill=gold, font=font(consola, 38), anchor='mm')
draw.text((130, 320), 'GitHub Stars', fill=brown, font=font(yahei, 12), anchor='mm')
draw.rectangle([245, 268, 246, 342], fill=(92, 64, 51))

draw.text((305, 290), '1.7K', fill=gold, font=font(consola, 38), anchor='mm')
draw.text((305, 320), 'Forks', fill=brown, font=font(yahei, 12), anchor='mm')
draw.rectangle([420, 268, 421, 342], fill=(92, 64, 51))

draw.text((480, 290), '29', fill=gold, font=font(consola, 38), anchor='mm')
draw.text((480, 320), '总提交数', fill=brown, font=font(yahei, 12), anchor='mm')
draw.rectangle([595, 268, 596, 342], fill=(92, 64, 51))

draw.text((660, 285), '核心能力', fill=(245, 240, 224), font=font(yahei, 14))
draw.text((660, 315), '🟡 代码审查', fill=brown, font=font(yahei, 12))
draw.text((660, 338), '🟡 任务委派', fill=brown, font=font(yahei, 12))

chips = [('对抗式审查', 840, 273), ('异步执行', 970, 273), ('Review Gate', 840, 307), ('Apache 2.0', 970, 307)]
for text, cx, cy in chips:
    draw.rounded_rectangle([cx, cy, cx + 130, cy + 26], radius=13, fill=(107, 76, 59))
    draw.text((cx + 65, cy + 13), text, fill=gold, font=font(yahei, 12), anchor='mm')

# Community
draw.text((55, 390), '🌍 开发者怎么说', fill=(61, 43, 31), font=font(yahei, 14))

for i, quote in enumerate([
    '"OpenAI official plugin that brings\nCodex code review into Claude Code."',
    '"Delegate tasks, review code, transfer\nsessions — all from inside Claude Code."'
]):
    x = 55 + i * 570
    draw.rounded_rectangle([x, 410, x + 550, 480], radius=8, fill=(250, 245, 240), outline=(232, 220, 200))
    for j, line in enumerate(quote.split('\n')):
        draw.text((x + 25, 431 + j * 22), line, fill=(92, 64, 51), font=font(yahei, 13))

draw.text((1120, 485), 'github.com/openai/codex-plugin-cc', fill=(196, 169, 125), font=font(consola, 11), anchor='rm')

img.save('D:/github/mattskill/codex-plugin/lessons/cover.png')
print('Cover PNG generated.')
"""Generate cover image for Meetily lesson using Pillow."""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1175, 500
img = Image.new('RGB', (W, H), (245, 240, 232))
draw = ImageDraw.Draw(img)

# Fonts
yahei = 'C:/Windows/Fonts/msyh.ttc'
yahei_bold = 'C:/Windows/Fonts/msyhbd.ttc'
consola = 'C:/Windows/Fonts/consola.ttf'

def font(name, size):
    return ImageFont.truetype(name, size)

# Decorative corner lines
draw.rectangle([30, 25, 90, 27], fill=(196, 169, 125))
draw.rectangle([30, 29, 70, 31], fill=(196, 169, 125))

# Version tag
draw.rounded_rectangle([30, 46, 170, 76], radius=14, fill=(196, 169, 125, 76))
ver_font = font(consola, 14)
draw.text((100, 60), 'v0.4.0 · MIT', fill=(139, 105, 20), font=ver_font, anchor='mm')

# Main title
title_font = font(yahei_bold, 40)
draw.text((55, 120), 'Meetily 入门', fill=(61, 43, 31), font=title_font)

# Subtitle
sub_font = font(yahei_bold, 26)
draw.text((55, 170), '打工人狂喜的 AI 会议助手', fill=(139, 105, 20), font=sub_font)

# One-liner
oneliner_font = font(yahei, 15)
draw.text((55, 210), '开源 · 全本地 · 实时转录 + AI 自动总结 · 22.3K+ Stars', fill=(92, 64, 51), font=oneliner_font)

# Dash line
for x in range(55, 1120, 8):
    draw.rectangle([x, 234, x + 4, 235], fill=(212, 196, 168))

# Stats banner
draw.rounded_rectangle([40, 255, 1135, 355], radius=12, fill=(61, 43, 31))

# Stats
stat_font = font(consola, 38)
stat_label = font(yahei, 12)
gold = (255, 215, 0)
brown_text = (196, 169, 125)

draw.text((130, 290), '22.3K+', fill=gold, font=stat_font, anchor='mm')
draw.text((130, 320), 'GitHub Stars', fill=brown_text, font=stat_label, anchor='mm')

draw.rectangle([245, 268, 246, 342], fill=(92, 64, 51))

draw.text((305, 290), '2.3K', fill=gold, font=stat_font, anchor='mm')
draw.text((305, 320), 'Forks', fill=brown_text, font=stat_label, anchor='mm')

draw.rectangle([420, 268, 421, 342], fill=(92, 64, 51))

draw.text((480, 290), '556', fill=gold, font=stat_font, anchor='mm')
draw.text((480, 320), '总提交数', fill=brown_text, font=stat_label, anchor='mm')

draw.rectangle([595, 268, 596, 342], fill=(92, 64, 51))

# Right side of banner: features
feat_title = font(yahei, 14)
feat_item = font(yahei, 12)
cream = (245, 240, 224)
draw.text((660, 285), '核心特性', fill=cream, font=feat_title)
draw.text((660, 315), '🟡 全本地运行', fill=brown_text, font=feat_item)
draw.text((660, 338), '🟡 实时转录', fill=brown_text, font=feat_item)

# Feature chips
chip_font = font(yahei, 12)
chips = [('AI 自动总结', 840, 273), ('GPU 加速', 970, 273), ('多平台支持', 840, 307), ('MIT 开源', 970, 307)]
for text, cx, cy in chips:
    draw.rounded_rectangle([cx, cy, cx + 130, cy + 26], radius=13, fill=(107, 76, 59))
    draw.text((cx + 65, cy + 13), text, fill=(255, 215, 0), font=chip_font, anchor='mm')

# Community section
draw.text((55, 390), '🌍 开发者怎么说', fill=(61, 43, 31), font=feat_title)

# Quote cards
quote_font = font(yahei, 13)
card_bg = (250, 245, 240)
card_border = (232, 220, 200)
for i, quote in enumerate([
    '"Privacy-first AI meeting assistant\nthat runs entirely on your machine."',
    '"No data leaves your computer.\nReal-time transcription + AI summaries."'
]):
    x = 55 + i * 570
    draw.rounded_rectangle([x, 410, x + 550, 480], radius=8, fill=card_bg, outline=card_border)
    lines = quote.split('\n')
    for j, line in enumerate(lines):
        draw.text((x + 25, 431 + j * 22), line, fill=(92, 64, 51), font=quote_font)

# Footer
footer_font = font(consola, 11)
draw.text((1120, 485), 'github.com/Zackriya-Solutions/meetily', fill=(196, 169, 125), font=footer_font, anchor='rm')

# Save
out_dir = 'D:/github/mattskill/meetily/lessons'
img.save(os.path.join(out_dir, 'cover.png'))
print('Cover PNG generated.')
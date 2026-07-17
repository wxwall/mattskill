"""Generate cover image for System Prompts Leaks lesson using Pillow."""
from PIL import Image, ImageDraw, ImageFont

W, H = 1175, 500
img = Image.new('RGB', (W, H), (245, 240, 232))
draw = ImageDraw.Draw(img)

yahei = 'C:/Windows/Fonts/msyh.ttc'
yahei_bold = 'C:/Windows/Fonts/msyhbd.ttc'
consola = 'C:/Windows/Fonts/consola.ttf'

def font(name, size):
    return ImageFont.truetype(name, size)

draw.rectangle([30, 25, 90, 27], fill=(196, 169, 125))
draw.rectangle([30, 29, 70, 31], fill=(196, 169, 125))
draw.rounded_rectangle([30, 46, 170, 76], radius=14, fill=(196, 169, 125, 76))
draw.text((100, 60), 'CC0-1.0 · 615 提交', fill=(139, 105, 20), font=font(consola, 14), anchor='mm')

draw.text((55, 120), 'System Prompts Leaks', fill=(61, 43, 31), font=font(yahei_bold, 40))
draw.text((55, 170), '全 AI 系统提示词档案馆，55.4K Stars', fill=(139, 105, 20), font=font(yahei_bold, 26))
draw.text((55, 210), 'Claude / ChatGPT / Gemini / Grok / Copilot / Cursor 等 20+ 产品', fill=(92, 64, 51), font=font(yahei, 15))

for x in range(55, 1120, 8):
    draw.rectangle([x, 234, x + 4, 235], fill=(212, 196, 168))

draw.rounded_rectangle([40, 255, 1135, 355], radius=12, fill=(61, 43, 31))
gold, brown = (255, 215, 0), (196, 169, 125)

draw.text((130, 290), '55.4K+', fill=gold, font=font(consola, 38), anchor='mm')
draw.text((130, 320), 'GitHub Stars', fill=brown, font=font(yahei, 12), anchor='mm')
draw.rectangle([245, 268, 246, 342], fill=(92, 64, 51))
draw.text((305, 290), '9.1K', fill=gold, font=font(consola, 38), anchor='mm')
draw.text((305, 320), 'Forks', fill=brown, font=font(yahei, 12), anchor='mm')
draw.rectangle([420, 268, 421, 342], fill=(92, 64, 51))
draw.text((480, 290), '652', fill=gold, font=font(consola, 38), anchor='mm')
draw.text((480, 320), 'Watchers', fill=brown, font=font(yahei, 12), anchor='mm')
draw.rectangle([595, 268, 596, 342], fill=(92, 64, 51))

draw.text((660, 285), '覆盖品牌', fill=(245, 240, 224), font=font(yahei, 14))
draw.text((660, 315), '🟡 Claude · ChatGPT', fill=brown, font=font(yahei, 12))
draw.text((660, 338), '🟡 Gemini · Grok', fill=brown, font=font(yahei, 12))

chips = [('Copilot', 840, 273), ('Cursor', 960, 273), ('华邮报道', 840, 307), ('CC0 协议', 960, 307)]
for text, cx, cy in chips:
    draw.rounded_rectangle([cx, cy, cx + 100, cy + 26], radius=13, fill=(107, 76, 59))
    draw.text((cx + 50, cy + 13), text, fill=gold, font=font(yahei, 12), anchor='mm')

draw.text((55, 390), '🌍 媒体怎么说', fill=(61, 43, 31), font=font(yahei, 14))

for i, quote in enumerate([
    '"The Washington Post featured this\nrepo — see the hidden rules behind AI"',
    '"System prompt instructions for all\nAI chatbots — Claude, ChatGPT, Gemini etc."'
]):
    x = 55 + i * 570
    draw.rounded_rectangle([x, 410, x + 550, 480], radius=8, fill=(250, 245, 240), outline=(232, 220, 200))
    for j, line in enumerate(quote.split('\n')):
        draw.text((x + 25, 431 + j * 22), line, fill=(92, 64, 51), font=font(yahei, 13))

draw.text((1120, 485), 'github.com/asgeirtj/system_prompts_leaks', fill=(196, 169, 125), font=font(consola, 11), anchor='rm')

out = 'D:/github/mattskill/system-prompts/lessons'
img.save(f'{out}/cover.png')
print('Cover PNG generated.')
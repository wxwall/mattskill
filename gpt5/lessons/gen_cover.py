from PIL import Image, ImageDraw, ImageFont

OUT = 'D:/github/mattskill/gpt5/lessons'
yahei = 'C:/Windows/Fonts/msyh.ttc'
yahei_bold = 'C:/Windows/Fonts/msyhbd.ttc'
consola = 'C:/Windows/Fonts/consola.ttf'

def f(name, size):
    return ImageFont.truetype(name, size)

W, H = 1175, 500
img = Image.new('RGB', (W, H), (245, 240, 232))
d = ImageDraw.Draw(img)

d.rectangle([30, 25, 90, 27], fill=(196, 169, 125))
d.rectangle([30, 29, 70, 31], fill=(196, 169, 125))
d.rounded_rectangle([30, 46, 190, 76], radius=14, fill=(196, 169, 125, 76))
d.text((110, 60), '2026-07-10 · 昨日发布', fill=(139, 105, 20), font=f(consola, 14), anchor='mm')

d.text((55, 120), 'GPT-5.6 Sol 来了', fill=(61, 43, 31), font=f(yahei_bold, 44))
d.text((55, 175), 'Extra High 推理，实测一把', fill=(139, 105, 20), font=f(yahei_bold, 28))
d.text((55, 215), 'OpenAI 最新最强推理模型 · 系统提示词 114KB · 代号 Sol', fill=(92, 64, 51), font=f(yahei, 14))

for x in range(55, 1120, 8):
    d.rectangle([x, 240, x + 4, 241], fill=(212, 196, 168))

d.rounded_rectangle([40, 260, 1135, 360], radius=12, fill=(61, 43, 31))
gold, brown = (255, 215, 0), (196, 169, 125)

d.text((130, 298), 'Extra High', fill=gold, font=f(consola, 34), anchor='mm')
d.text((130, 325), '推理深度', fill=brown, font=f(yahei, 12), anchor='mm')
d.rectangle([245, 273, 246, 347], fill=(92, 64, 51))
d.text((305, 298), '2026-07', fill=gold, font=f(consola, 34), anchor='mm')
d.text((305, 325), '发布日期', fill=brown, font=f(yahei, 12), anchor='mm')
d.rectangle([420, 273, 421, 347], fill=(92, 64, 51))
d.text((480, 298), '114KB', fill=gold, font=f(consola, 34), anchor='mm')
d.text((480, 325), '系统提示词', fill=brown, font=f(yahei, 12), anchor='mm')
d.rectangle([595, 273, 596, 347], fill=(92, 64, 51))

d.text((660, 290), '核心升级', fill=(245, 240, 224), font=f(yahei, 14))
d.text((660, 320), '🟡 Sol 推理模式', fill=brown, font=f(yahei, 12))
d.text((660, 343), '🟡 强制网络搜索', fill=brown, font=f(yahei, 12))

chips = [('Gmail 集成', 840, 278), ('话更简洁', 970, 278), ('自动化任务', 840, 312), ('Codex 版本', 970, 312)]
for t, cx, cy in chips:
    d.rounded_rectangle([cx, cy, cx + 110, cy + 26], radius=13, fill=(107, 76, 59))
    d.text((cx + 55, cy + 13), t, fill=gold, font=f(yahei, 12), anchor='mm')

d.text((55, 395), '🌍 开发者怎么说', fill=(61, 43, 31), font=f(yahei, 14))
for i, quote in enumerate([
    '"GPT-5.6 Sol extra high is the most\npowerful reasoning model from OpenAI yet."',
    '"The system prompt is 114KB — more\ndetailed than any official release notes."'
]):
    x = 55 + i * 570
    d.rounded_rectangle([x, 410, x + 550, 480], radius=8, fill=(250, 245, 240), outline=(232, 220, 200))
    for j, line in enumerate(quote.split('\n')):
        d.text((x + 25, 431 + j * 22), line, fill=(92, 64, 51), font=f(yahei, 13))

d.text((1120, 485), 'github.com/asgeirtj/system_prompts_leaks', fill=(196, 169, 125), font=f(consola, 11), anchor='rm')
img.save(f'{OUT}/cover.png')
img.convert('RGB').save(f'{OUT}/cover.jpg', 'JPEG', quality=95)
print('Cover done')
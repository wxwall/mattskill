import re
import sys

def minify_for_wechat(html):
    """
    Remove whitespace between HTML tags and text content.
    - > followed by whitespace then text: collapse to >text
    - text followed by whitespace then <: collapse to text<
    - Multiple spaces between words: preserve one space
    - Whitespace between > and < (between tags): remove entirely
    """
    # 1. Remove whitespace between closing > and opening < (between tags)
    html = re.sub(r'>\s+<', '><', html)

    # 2. Remove whitespace between closing > and text content
    #    >\n  文字  ->  >文字
    html = re.sub(r'>(\s+)([^\s<])', lambda m: '>' + m.group(2), html)

    # 3. Remove whitespace between text content and opening <
    #    文字\n  </  ->  文字</
    html = re.sub(r'([^\s>])(\s+)<', lambda m: m.group(1) + '<', html)

    # 4. But restore single spaces between words within text nodes
    #    This is tricky - we just need to not collapse intentional intra-text whitespace
    #    The above patterns already handle this correctly by only removing whitespace
    #    that's adjacent to < or >.

    return html

for filepath in sys.argv[1:]:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    result = minify_for_wechat(content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(result)

    print(f'{filepath}: minimized')

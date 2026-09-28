import re

with open('src/context/AppContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

def replacer(match):
    type_name = match.group(1)
    return f"useState<{type_name}>([])"

content = re.sub(r'useState<([^>]+)>\(\(\) => \{[\s\S]*?return mock[^;]+;\s*\}\)', replacer, content)

content = re.sub(r'useState<([^>]+)>\(mock[a-zA-Z]+\)', r'useState<\1>([])', content)

with open('src/context/AppContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

import re

with open('src/context/AppContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'// === QUICK INVOICE ITEMS ===.*?};\s*', '// === QUICK INVOICE ITEMS ===\n', content, count=1, flags=re.DOTALL)

with open('src/context/AppContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

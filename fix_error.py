import sys

with open('src/context/AppContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("error('Erreur', 'Impossible de cr", "showError('Erreur', 'Impossible de cr")
content = content.replace("error('Erreur', 'Impossible de mettre", "showError('Erreur', 'Impossible de mettre")

with open('src/context/AppContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

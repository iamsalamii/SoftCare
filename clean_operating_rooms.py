import re

with open('src/components/surgery/SurgeryModule.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove operatingRooms from useApp
content = re.sub(r'operatingRooms,\s*', '', content)
content = re.sub(r'addOperatingRoom,\s*', '', content)

# Remove getORName function
content = re.sub(r'const getORName = \(roomId: string\) => \{.*?\};\s*', '', content, flags=re.DOTALL)

# Replace usage of getORName with static string
content = content.replace('${getORName(s.operatingRoomId)}', 'Bloc Polyvalent')

# Also remove OperatingRoom from types if it's imported
# But it might be in src/types/index.ts
with open('src/components/surgery/SurgeryModule.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/types/index.ts', 'r', encoding='utf-8') as f:
    types_content = f.read()

types_content = re.sub(r'export interface OperatingRoom \{.*?\};\s*', '', types_content, flags=re.DOTALL)

with open('src/types/index.ts', 'w', encoding='utf-8') as f:
    f.write(types_content)

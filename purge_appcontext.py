import re
import os

with open('src/context/AppContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove mockData imports
content = re.sub(r'import\s+\{([^}]+)\}\s+from\s+[\'"]\.\./data/mockData[\'"];', '', content)

# 2. Remove localStorage.setItem completely
content = re.sub(r'localStorage\.setItem\([^\)]+\);\s*', '', content)
# Also remove localStorage.getItem
content = re.sub(r'const\s+saved\s*=\s*localStorage\.getItem\([^\)]+\);\s*if\s*\(saved\)\s*\{\s*return\s*JSON\.parse\(saved\);\s*\}\s*', '', content)

# 3. Replace addMedication
old_addMedication = r'const addMedication = async \(medication: Partial<Medication>\) => \{.*?\s+success\([^\)]+\);\s*\};'
new_addMedication = """const addMedication = async (medication: Partial<Medication>) => {
    try {
      const created = await apiService.medications.create(medication);
      setMedications(prev => [created, ...prev]);
      success('Médicament ajouté');
    } catch (error: any) {
      showError(error);
    }
  };"""
content = re.sub(old_addMedication, new_addMedication, content, flags=re.DOTALL)

# 4. Replace addInvoice
old_addInvoice = r'const addInvoice = async \(invoice: Partial<Invoice>, items: Partial<Invoice\[\'items\'\]>\[number\]\[\]\) => \{.*?\s+success\([^\)]+\);\s*\};'
new_addInvoice = """const addInvoice = async (invoice: Partial<Invoice>, items: Partial<Invoice['items']>[number][]) => {
    try {
      const created = await apiService.invoices.create({ ...invoice, items: items as any });
      setInvoicesState(prev => [created, ...prev]);
      success('Facture créée');
    } catch (error: any) {
      showError(error);
    }
  };"""
content = re.sub(old_addInvoice, new_addInvoice, content, flags=re.DOTALL)

# 5. Replace addBed
old_addBed = r'const addBed = async \(bed: Partial<Bed>\) => \{.*?\s+success\([^\)]+\);\s*\};'
new_addBed = """const addBed = async (bed: Partial<Bed>) => {
    try {
      const created = await apiService.beds.create(bed);
      setBedsState(prev => [created, ...prev]);
      success('Lit ajouté');
    } catch (error: any) {
      showError(error);
    }
  };"""
content = re.sub(old_addBed, new_addBed, content, flags=re.DOTALL)

# 6. Remove addQuickInvoiceItem completely
content = re.sub(r'const addQuickInvoiceItem = async \(item: Partial<QuickInvoiceItem>\) => \{.*?\};\s*', '', content, flags=re.DOTALL)

# 7. Remove OperatingRooms
content = re.sub(r'operatingRooms: OperatingRoom\[\];\s*', '', content)
content = re.sub(r'addOperatingRoom: \(room: Partial<OperatingRoom>\) => Promise<void>;\s*', '', content)
content = re.sub(r'updateOperatingRoom: \(id: string, updates: Partial<OperatingRoom>\) => Promise<void>;\s*', '', content)
content = re.sub(r'const \[operatingRooms, setOperatingRooms\] = useState<OperatingRoom\[\]>\(\[\]\);\s*', '', content)
content = re.sub(r'const addOperatingRoom = async \(room: Partial<OperatingRoom>\) => \{.*?\s+success\([^\)]+\);\s*\};', '', content, flags=re.DOTALL)
content = re.sub(r'const updateOperatingRoom = async \(id: string, updates: Partial<OperatingRoom>\) => \{.*?\s+success\([^\)]+\);\s*\};', '', content, flags=re.DOTALL)
content = re.sub(r'operatingRooms,\s*', '', content)
content = re.sub(r'setOperatingRooms,\s*', '', content)
content = re.sub(r'addOperatingRoom,\s*', '', content)
content = re.sub(r'updateOperatingRoom,\s*', '', content)

# 8. Remove genId function
content = re.sub(r'const genId = \(\) => Date\.now\(\)\.toString\(\) \+ Math\.random\(\)\.toString\(36\)\.substring\(2, 8\);\s*', '', content)

with open('src/context/AppContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# We can also delete mockData.ts now
if os.path.exists('src/data/mockData.ts'):
    os.remove('src/data/mockData.ts')

import re

with open('src/context/AppContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

nursing_fetch = """
      try {
        const apiVitals = await apiService.vitals.getAll();
        setVitalsList(apiVitals);
      } catch {
        setVitalsList([]);
      }

      try {
        const apiCarePlans = await apiService.carePlans.getAll();
        setCarePlans(apiCarePlans);
      } catch {
        setCarePlans([]);
      }

      try {
        const apiNotes = await apiService.nursingNotes.getAll();
        setNursingNotes(apiNotes);
      } catch {
        setNursingNotes([]);
      }
"""

pattern = r'(\s*\} catch \(error: any\) \{\s*setDataError)'
content = re.sub(pattern, nursing_fetch + r'\1', content, count=1)

with open('src/context/AppContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

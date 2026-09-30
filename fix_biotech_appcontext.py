import re

with open('src/context/AppContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace addGenomicProfile
old_addGenomicProfile = r'const addGenomicProfile = async \(profile: Partial<GenomicProfile>\) => \{.*?\s+success\([^\)]+\);\s*\};'
new_addGenomicProfile = """const addGenomicProfile = async (profile: Partial<GenomicProfile>) => {
    try {
      const created = await apiService.biotech.createGenomicProfile(profile);
      setGenomicProfiles(prev => [created, ...prev]);
      success('Profil génomique enregistré');
    } catch (error: any) {
      showError(error);
    }
  };"""
content = re.sub(old_addGenomicProfile, new_addGenomicProfile, content, flags=re.DOTALL)

# Replace addBioSample
old_addBioSample = r'const addBioSample = async \(sample: Partial<BioSample>\) => \{.*?\s+success\([^\)]+\);\s*\};'
new_addBioSample = """const addBioSample = async (sample: Partial<BioSample>) => {
    try {
      const created = await apiService.biotech.createBioSample(sample);
      setBioSamples(prev => [created, ...prev]);
      success('Échantillon enregistré');
    } catch (error: any) {
      showError(error);
    }
  };"""
content = re.sub(old_addBioSample, new_addBioSample, content, flags=re.DOTALL)

# Replace addClinicalTrial
old_addClinicalTrial = r'const addClinicalTrial = async \(trial: Partial<ClinicalTrial>\) => \{.*?\s+success\([^\)]+\);\s*\};'
new_addClinicalTrial = """const addClinicalTrial = async (trial: Partial<ClinicalTrial>) => {
    try {
      const created = await apiService.biotech.createTrial(trial);
      setClinicalTrials(prev => [created, ...prev]);
      success('Essai clinique enregistré');
    } catch (error: any) {
      showError(error);
    }
  };"""
content = re.sub(old_addClinicalTrial, new_addClinicalTrial, content, flags=re.DOTALL)


refresh_additions = """
      try {
        const apiGenomics = await apiService.biotech.getGenomicProfiles();
        setGenomicProfiles(apiGenomics);
      } catch {
        setGenomicProfiles([]);
      }

      try {
        const apiSamples = await apiService.biotech.getBioSamples();
        setBioSamples(apiSamples);
      } catch {
        setBioSamples([]);
      }

      try {
        const apiTrials = await apiService.biotech.getTrials();
        setClinicalTrials(apiTrials);
      } catch {
        setClinicalTrials([]);
      }
"""
pattern = r'(\s*\} catch \(error: any\) \{\s*setDataError)'
content = re.sub(pattern, refresh_additions + r'\1', content, count=1)

with open('src/context/AppContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

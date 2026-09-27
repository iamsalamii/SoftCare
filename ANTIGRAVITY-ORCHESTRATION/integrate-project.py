# -*- coding: utf-8 -*-
"""
Script d'intégration universel pour ANTIGRAVITY-ORCHESTRATION.
Permet d'initialiser l'orchestration multi-agents sur n'importe quel projet.
Usage :
    python integrate-project.py "C:\chemin\vers\mon-projet"
"""
import sys
import shutil
from pathlib import Path

CENTRAL_DIR = Path(__file__).resolve().parent

def integrate_project(project_path_str: str):
    target_path = Path(project_path_str).resolve()
    if not target_path.exists() or not target_path.is_dir():
        print(f"[ERREUR] Le répertoire spécifié n'existe pas : {target_path}")
        sys.exit(1)

    print(f"[ANTIGRAVITY-ORCHESTRATION] Connexion du projet : {target_path}")

    # 1. Création des dossiers
    antigravity_dir = target_path / ".antigravity"
    agents_dir = target_path / ".agents"
    rules_dir = agents_dir / "rules"

    antigravity_dir.mkdir(parents=True, exist_ok=True)
    rules_dir.mkdir(parents=True, exist_ok=True)

    # 2. Copie / Initialisation des templates
    context_dst = antigravity_dir / "project-context.md"
    if not context_dst.exists():
        shutil.copy(CENTRAL_DIR / "templates" / "project-context.md", context_dst)
        print("  [+] Fiche de contexte créée : .antigravity/project-context.md")
    else:
        print("  [=] Fiche de contexte existante conservée : .antigravity/project-context.md")

    rules_dst = antigravity_dir / "project-rules.md"
    if not rules_dst.exists():
        shutil.copy(CENTRAL_DIR / "templates" / "project-rules.md", rules_dst)
        print("  [+] Règles du projet créées : .antigravity/project-rules.md")
    else:
        print("  [=] Règles existantes conservées : .antigravity/project-rules.md")

    # 3. Liaison de compétences
    skills_json = agents_dir / "skills.json"
    skills_json_content = '{\n  "entries": [\n    {\n      "path": "' + str(CENTRAL_DIR / "skills").replace("\\", "\\\\") + '"\n    }\n  ]\n}\n'
    skills_json.write_text(skills_json_content, encoding="utf-8")
    print("  [+] Liaison des compétences : .agents/skills.json")

    # 4. Règle d'orchestration Antigravity
    orch_rule = rules_dir / "orchestration-rules.md"
    orch_rule_content = f"""# RÈGLE WORKSPACE ANTIGRAVITY - ORCHESTRATION ACTIVE

L'orchestration centrale ANTIGRAVITY-ORCHESTRATION est active sur ce projet.
- Emplacement central : {CENTRAL_DIR}
- Rôle par défaut : Orchestrateur / Tech Lead.
- Respecter scrupuleusement les 20 règles d'ingénierie de RULES.md.
- Contexte projet : .antigravity/project-context.md.
- Règles spécifiques : .antigravity/project-rules.md.
"""
    orch_rule.write_text(orch_rule_content.strip(), encoding="utf-8")
    print("  [+] Règle d'orchestration : .agents/rules/orchestration-rules.md")

    # 5. Instructions GEMINI.md & AGENTS.md
    gemini_file = target_path / "GEMINI.md"
    gemini_content = f"""# DIRECTIVES D'ORCHESTRATION IA - WORKSPACE ACTIF

Ce projet est piloté par le système central **ANTIGRAVITY-ORCHESTRATION** situé à :
`{CENTRAL_DIR}`

---

## 1. Principes d'Intervention
1. **Respect de l'Existant** : Analyser le code existant avant toute modification. Ne jamais détruire de fonctionnalité sans justification explicite.
2. **PostgreSQL par Défaut** : Pour toute persistance de données relationnelles.
3. **Division du Travail** : Mobiliser dynamiquement l'Orchestrateur, l'Architecte, les Spécialistes Backend/Frontend, le DBA, le Codeur, le Testeur et le Réviseur selon la matrice de décision.
4. **Sas Qualité Bloquant** : Validation obligatoire par la suite de tests et le Réviseur avant toute acceptation.

---

## 2. Référentiels du Projet
- Contexte et stack : `.antigravity/project-context.md`
- Règles et invariants : `.antigravity/project-rules.md`
- Matrice de décision : `{CENTRAL_DIR / "orchestrator" / "decision-matrix.md"}`
- Registre des agents : `{CENTRAL_DIR / "AGENTS.md"}`
"""
    gemini_file.write_text(gemini_content.strip(), encoding="utf-8")
    print("  [+] Fichier d'instructions Antigravity créé : GEMINI.md")

    agents_file = target_path / "AGENTS.md"
    shutil.copy(CENTRAL_DIR / "AGENTS.md", agents_file)
    print("  [+] Annuaire des 17 agents copié : AGENTS.md")

    print(f"\n[SUCCÈS] Le projet {target_path.name} est désormais connecté à ANTIGRAVITY-ORCHESTRATION !")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        target = sys.argv[1]
    else:
        target = "."
    integrate_project(target)
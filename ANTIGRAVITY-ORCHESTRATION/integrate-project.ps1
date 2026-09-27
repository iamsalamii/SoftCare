<#
.SYNOPSIS
    Connecte et integre n'importe quel projet de developpement a ANTIGRAVITY-ORCHESTRATION.
.DESCRIPTION
    Ce script cree les fichiers de configuration Antigravity (GEMINI.md, AGENTS.md, .agents, .antigravity)
    a la racine du projet cible pour activer immediatement l'orchestration multi-agents.
.PARAMETER ProjectPath
    Chemin du projet a integrer (par defaut : repertoire courant).
.EXAMPLE
    .\integrate-project.ps1 -ProjectPath "C:\MesProjets\MonApplication"
#>

param(
    [string]$ProjectPath = (Get-Location).Path
)

$targetPath = [System.IO.Path]::GetFullPath($ProjectPath)
if (-not (Test-Path $targetPath)) {
    Write-Error "Le chemin specifie n'existe pas : $targetPath"
    exit 1
}

Write-Host "[ANTIGRAVITY-ORCHESTRATION] Integration en cours dans : $targetPath" -ForegroundColor Cyan

# 1. Creation des repertoires d'orchestration
$antigravityDir = Join-Path $targetPath ".antigravity"
$agentsDir = Join-Path $targetPath ".agents"
$rulesDir = Join-Path $agentsDir "rules"

New-Item -ItemType Directory -Force -Path $antigravityDir | Out-Null
New-Item -ItemType Directory -Force -Path $rulesDir | Out-Null

# 2. Copie / Creation des gabarits de projet
$contextPath = Join-Path $antigravityDir "project-context.md"
if (-not (Test-Path $contextPath)) {
    Copy-Item "C:\Users\DELL\Desktop\ANTIGRAVITY-ORCHESTRATION\templates\project-context.md" $contextPath
    Write-Host "  [+] Fiche de contexte creee : .antigravity/project-context.md" -ForegroundColor Green
} else {
    Write-Host "  [=] Fiche de contexte existante conservee : .antigravity/project-context.md" -ForegroundColor Yellow
}

$rulesPath = Join-Path $antigravityDir "project-rules.md"
if (-not (Test-Path $rulesPath)) {
    Copy-Item "C:\Users\DELL\Desktop\ANTIGRAVITY-ORCHESTRATION\templates\project-rules.md" $rulesPath
    Write-Host "  [+] Regles du projet creees : .antigravity/project-rules.md" -ForegroundColor Green
} else {
    Write-Host "  [=] Regles existantes conservees : .antigravity/project-rules.md" -ForegroundColor Yellow
}

# 3. Creation des liaisons de configuration .agents
$skillsJsonPath = Join-Path $agentsDir "skills.json"
$skillsJsonContent = @'
{
  "entries": [
    {
      "path": "C:\\Users\\DELL\\Desktop\\ANTIGRAVITY-ORCHESTRATION\\skills"
    }
  ]
}
'@
Set-Content -Path $skillsJsonPath -Value $skillsJsonContent -Encoding utf8
Write-Host "  [+] Liaison des competences : .agents/skills.json" -ForegroundColor Green

$orchRulePath = Join-Path $rulesDir "orchestration-rules.md"
$orchRuleContent = @'
# REGLE WORKSPACE ANTIGRAVITY - ORCHESTRATION ACTIVE

L'orchestration centrale ANTIGRAVITY-ORCHESTRATION est active sur ce projet.
- Emplacement central : C:\Users\DELL\Desktop\ANTIGRAVITY-ORCHESTRATION
- Role par defaut : Orchestrateur / Tech Lead.
- Respecter scrupuleusement les 20 regles d'ingenierie de RULES.md.
- Contexte projet : .antigravity/project-context.md.
- Regles specifiques : .antigravity/project-rules.md.
'@
Set-Content -Path $orchRulePath -Value $orchRuleContent -Encoding utf8
Write-Host "  [+] Regle d'orchestration : .agents/rules/orchestration-rules.md" -ForegroundColor Green

# 4. Creation de GEMINI.md et AGENTS.md a la racine du projet
$geminiPath = Join-Path $targetPath "GEMINI.md"
$geminiContent = @'
# DIRECTIVES D'ORCHESTRATION IA - WORKSPACE ACTIF

Ce projet est pilote par le systeme central **ANTIGRAVITY-ORCHESTRATION** situe a :
`C:\Users\DELL\Desktop\ANTIGRAVITY-ORCHESTRATION`

---

## 1. Principes d'Intervention
1. **Respect de l'Existant** : Analyser le code existant avant toute modification. Ne jamais detruire de fonctionnalite sans justification explicite.
2. **PostgreSQL par Defaut** : Pour toute persistance de donnees relationnelles.
3. **Division du Travail** : Mobiliser dynamiquement l'Orchestrateur, l'Architecte, les Specialistes Backend/Frontend, le DBA, le Codeur, le Testeur et le Reviseur selon la matrice de decision.
4. **Sas Qualite Bloquant** : Validation obligatoire par la suite de tests et le Reviseur avant toute acceptation.

---

## 2. Referentiels du Projet
- Contexte et stack : `.antigravity/project-context.md`
- Regles et invariants : `.antigravity/project-rules.md`
- Matrice de decision : `C:\Users\DELL\Desktop\ANTIGRAVITY-ORCHESTRATION\orchestrator\decision-matrix.md`
- Registre des agents : `C:\Users\DELL\Desktop\ANTIGRAVITY-ORCHESTRATION\AGENTS.md`
'@
Set-Content -Path $geminiPath -Value $geminiContent -Encoding utf8
Write-Host "  [+] Fichier d'instructions Antigravity cree : GEMINI.md" -ForegroundColor Green

$agentsPath = Join-Path $targetPath "AGENTS.md"
Copy-Item "C:\Users\DELL\Desktop\ANTIGRAVITY-ORCHESTRATION\AGENTS.md" $agentsPath
Write-Host "  [+] Annuaire des 17 agents copie : AGENTS.md" -ForegroundColor Green

Write-Host "`n[SUCCES] Le projet $targetPath est desormais parfaitement connecte a ANTIGRAVITY-ORCHESTRATION !" -ForegroundColor Green
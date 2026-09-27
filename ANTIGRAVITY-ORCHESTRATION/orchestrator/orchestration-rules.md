# Règles Formelles d'Orchestration (orchestration-rules.md)

Ce document définit les protocoles stricts régissant la coordination inter-agents au sein de `ANTIGRAVITY-ORCHESTRATION`.

---

## 1. Principes d'Engagement
- **Sélection Minimale Efficace** : N'activer que les profils strictement indispensables pour accomplir la tâche. Une simple retouche de texte ne doit mobiliser que le Codeur et le Réviseur.
- **Autorité de l'Orchestrateur** : L'Orchestrateur a la responsabilité exclusive de désigner les agents intervenants, d'arbitrer les conflits et de déclarer la tâche close.
- **Droit de Veto du Réviseur et du Testeur** : Si le Testeur signale des tests en échec ou si le Réviseur refuse le diff, l'Orchestrateur bloque impérativement la livraison et renvoie le mandat au Codeur.

## 2. Protocoles d'Échange et Passage de Témoin
- **Sortie Typée & Structurée** : Chaque agent doit formater son livrable pour que l'agent suivant dispose de toutes les clés d'exécution sans ambiguïté.
- **Zéro Présomption** : Aucun agent n'est autorisé à considérer qu'une étape amont est validée sans avoir inspecté l'artefact produit.
- **Notification d'Incertitude** : Tout doute sur un comportement système ou une exigence métier doit être formellement signalé dans le compte-rendu d'étape.

## 3. Gestion des Conflits Techniques
Lorsque deux spécialistes émettent des recommandations divergentes (ex: Normalisation stricte du DBA vs Vitesse de lecture du Spécialiste Backend) :
1. Les spécialistes exposent leurs arguments chiffrés et conséquences prévisibles.
2. L'Architecte propose un compromis conforme aux objectifs directeurs du projet.
3. L'Orchestrateur tranche définitivement et consigne la décision dans un ADR.
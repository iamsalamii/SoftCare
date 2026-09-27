# Rapport d'Anomalie : [Titre Concis du Bug]

Fiche d'investigation et de diagnostic de cause racine.

---

## 1. Symptômes & Constat
- **Date / Environnement** : [Développement / Staging / Production]
- **Composant Impacté** : [Frontend React / API Backend / Base PostgreSQL]
- **Comportement Observé** : [Ce qui se produit réellement, message d'erreur ou exception]
- **Comportement Attendu** : [Ce qui aurait dû se produire normalement]

---

## 2. Traces Techniques
```text
[Coller ici la stack trace complète, l'extrait de log d'erreur ou la requête HTTP fautive]
```

---

## 3. Protocole de Reproduction Pas-à-Pas
1. Se connecter avec le compte [Type de compte]
2. Naviguer vers l'URL `/...`
3. Remplir le formulaire avec les valeurs : `...`
4. Cliquer sur le bouton [Action]
5. Constater l'erreur [Code HTTP ou Exception]

---

## 4. Analyse de Cause Racine (Root Cause Analysis)
- **Cause Immédiate** : [Pourquoi le crash survient-il à cette ligne précise ?]
- **Cause Fondamentale** : [Pourquoi l'état invalide a-t-il pu atteindre ce niveau sans être intercepté ?]
- **Règle enfreinte** : [ex: Absence de validation de nullabilité, timeout de verrou, etc.]

---

## 5. Stratégie de Remédiation & Non-Régression
- **Test de Régression** : [Nom du test automatisé rouge rédigé pour prouver l'anomalie]
- **Correctif Prévu** : [Description de l'intervention chirurgicale minimale sur le code]
- **Vérification** : [Confirmation du passage au vert du test après correction]
# SoftCare Scripts

## Sauvegarde automatique de la base de données (Backup)
Le script `backup-db.sh` permet de sauvegarder la base de données PostgreSQL, de la compresser et de la chiffrer (si configuré).

Pour activer la sauvegarde automatique tous les jours à 2h00 du matin, configurez un **cronjob** sur votre serveur Linux :

1. Ouvrez l'éditeur cron :
```bash
crontab -e
```

2. Ajoutez la ligne suivante (adaptez les chemins) :
```bash
0 2 * * * /chemin/vers/project-softcare/scripts/backup-db.sh >> /var/log/softcare-backup.log 2>&1
```

## Row Level Security (RLS)
Le script `enable-rls.sql` permet d'activer le RLS (Row Level Security) sur PostgreSQL.
Pour l'appliquer :
```bash
psql -U postgres -d softcare -f scripts/enable-rls.sql
```

#!/usr/bin/env bash
# ==============================================================================
# SoftCare Hospital Information System - Automated Database Backup Script
# Usage: Run via cron (e.g. 0 2 * * * /path/to/backup-db.sh)
# Compliant with HDS (Hébergeur de Données de Santé) & RGPD
# ==============================================================================

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/softcare}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILENAME="softcare_db_backup_${TIMESTAMP}.sql.gz.enc"
RETENTION_DAYS=30

# Database credentials (loaded from secure environment)
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_NAME="${POSTGRES_DB:-softcare}"
DB_USER="${POSTGRES_USER:-postgres}"

mkdir -p "${BACKUP_DIR}"

echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Starting automated database backup for: ${DB_NAME}"

# 1. Export database dump, gzip compress and encrypt (AES-256-CBC)

if [ -n "${POSTGRES_PASSWORD:-}" ]; then
  export PGPASSWORD="${POSTGRES_PASSWORD}"
fi

if [ -n "${BACKUP_ENCRYPTION_KEY:-}" ]; then
  pg_dump -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" "${DB_NAME}" \
    | gzip -9 \
    | openssl enc -aes-256-cbc -salt -pbkdf2 -pass env:BACKUP_ENCRYPTION_KEY \
    > "${BACKUP_DIR}/${BACKUP_FILENAME}"
else
  # Fallback to standard gzipped dump if no encryption key provided
  BACKUP_FILENAME="softcare_db_backup_${TIMESTAMP}.sql.gz"
  pg_dump -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" "${DB_NAME}" \
    | gzip -9 \
    > "${BACKUP_DIR}/${BACKUP_FILENAME}"
fi

unset PGPASSWORD

echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Backup completed successfully: ${BACKUP_DIR}/${BACKUP_FILENAME}"

# 2. Enforce retention policy: Purge backups older than RETENTION_DAYS
echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Purging backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -type f -name "softcare_db_backup_*" -mtime +${RETENTION_DAYS} -delete

echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Backup and cleanup routine finished."

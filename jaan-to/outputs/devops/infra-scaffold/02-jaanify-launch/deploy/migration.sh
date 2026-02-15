#!/bin/bash
# Jaanify — Database Migration Script
# Usage: ./migration.sh [deploy|status|reset]
# Requires: DATABASE_URL environment variable

set -euo pipefail

COMMAND="${1:-deploy}"

case "$COMMAND" in
  deploy)
    echo "Running Prisma migrations..."
    cd apps/api
    npx prisma migrate deploy
    echo "Migrations complete."
    ;;
  status)
    echo "Checking migration status..."
    cd apps/api
    npx prisma migrate status
    ;;
  reset)
    echo "WARNING: This will reset the database!"
    read -r -p "Are you sure? (y/N) " confirm
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
      cd apps/api
      npx prisma migrate reset --force
      echo "Database reset complete."
    else
      echo "Cancelled."
    fi
    ;;
  *)
    echo "Usage: $0 [deploy|status|reset]"
    exit 1
    ;;
esac

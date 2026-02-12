#!/usr/bin/env bash
# Jaanify — Database migration script
# Runs Prisma migrations in CI/CD or locally
#
# Usage:
#   ./deploy/migration.sh              # Run pending migrations
#   ./deploy/migration.sh --status     # Show migration status
#   ./deploy/migration.sh --reset      # Reset database (DESTRUCTIVE)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[migrate]${NC} $*"; }
warn() { echo -e "${YELLOW}[migrate]${NC} $*"; }
error() { echo -e "${RED}[migrate]${NC} $*" >&2; }

# Verify DATABASE_URL is set
if [ -z "${DATABASE_URL:-}" ]; then
  error "DATABASE_URL is not set. Export it or create .env file."
  exit 1
fi

cd "$PROJECT_ROOT"

case "${1:-deploy}" in
  --status)
    log "Checking migration status..."
    pnpm --filter api exec prisma migrate status
    ;;

  --reset)
    warn "⚠ This will DESTROY all data in the database!"
    read -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
      log "Resetting database..."
      pnpm --filter api exec prisma migrate reset --force
      log "Database reset complete."
    else
      log "Aborted."
    fi
    ;;

  deploy|"")
    log "Running pending migrations..."
    pnpm --filter api exec prisma migrate deploy

    log "Generating Prisma Client..."
    pnpm --filter api exec prisma generate

    log "Migrations complete."
    ;;

  *)
    error "Unknown command: $1"
    echo "Usage: $0 [--status|--reset|deploy]"
    exit 1
    ;;
esac

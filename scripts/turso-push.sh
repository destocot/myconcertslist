#!/usr/bin/env bash
set -euo pipefail

MIGRATIONS_DIR="$(dirname "$0")/../prisma/migrations"

mapfile -t dirs < <(find "$MIGRATIONS_DIR" -mindepth 1 -maxdepth 1 -type d | sort)

if [[ ${#dirs[@]} -eq 0 ]]; then
  echo "No migrations found in $MIGRATIONS_DIR" >&2
  exit 1
fi

echo "Select migration to push to concertsdb:"
select dir in "${dirs[@]}"; do
  if [[ -n "$dir" ]]; then
    sql_file="$dir/migration.sql"
    if [[ ! -f "$sql_file" ]]; then
      echo "migration.sql not found in $dir" >&2
      exit 1
    fi
    echo "Pushing: $sql_file"
    turso db shell concertsdb < "$sql_file"
    break
  else
    echo "Invalid selection" >&2
  fi
done

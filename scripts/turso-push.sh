#!/usr/bin/env bash
set -euo pipefail

MIGRATIONS_DIR="$(dirname "$0")/../prisma/migrations"

mapfile -t dirs < <(find "$MIGRATIONS_DIR" -mindepth 1 -maxdepth 1 -type d | sort)

total=${#dirs[@]}
if [[ $total -eq 0 ]]; then
  echo "No migrations found in $MIGRATIONS_DIR" >&2
  exit 1
fi

start=$(( total - 2 ))
[[ $start -lt 0 ]] && start=0

echo "Select migration to push to concertsdb:"
for (( i=start; i<total; i++ )); do
  echo "$((i+1))) $(basename "${dirs[$i]}")"
done

while true; do
  read -rp "#? " choice
  idx=$(( choice - 1 ))
  if [[ $idx -ge $start && $idx -lt $total ]]; then
    sql_file="${dirs[$idx]}/migration.sql"
    if [[ ! -f "$sql_file" ]]; then
      echo "migration.sql not found in ${dirs[$idx]}" >&2
      exit 1
    fi
    echo "Pushing: $sql_file"
    turso db shell concertsdb < "$sql_file"
    break
  else
    echo "Invalid selection" >&2
  fi
done

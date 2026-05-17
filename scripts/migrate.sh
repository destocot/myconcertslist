#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 || -z "$1" ]]; then
  echo "Usage: $0 <migration-name>" >&2
  exit 1
fi

pnpm prisma migrate dev --name "$1"

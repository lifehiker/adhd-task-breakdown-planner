#!/bin/sh
set -eu

mkdir -p "$HOME" "$XDG_CACHE_HOME" /data

db_path="${DATABASE_URL#file:}"

if [ "$db_path" = "$DATABASE_URL" ]; then
  echo "DATABASE_URL must use sqlite file: syntax, received: $DATABASE_URL" >&2
  exit 1
fi

mkdir -p "$(dirname "$db_path")"

if [ ! -f "$db_path" ] || ! sqlite3 "$db_path" ".tables" | grep -q "TaskSession"; then
  echo "Initializing SQLite schema..."
  sqlite3 "$db_path" < /app/prisma/init.sql
fi

echo "Starting FocusSteps..."
exec node server.js

#!/bin/sh

set -e

host="db"
port="5432"

until pg_isready -h "$host" -p "$port" -U "postgres"; do
  echo "Aguardando PostgreSQL..."
  sleep 1
done

echo "PostgreSQL está pronto!"
exec /app/.docker/backend/entrypoint.sh
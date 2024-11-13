#!/bin/sh

set -e

host="db"
port="5432"
max_retries=30
counter=0

until pg_isready -h "$host" -p "$port" -U "postgres"; do
  counter=$((counter + 1))
  if [ $counter -gt $max_retries ]; then
    >&2 echo "Postgres não está disponível após $max_retries tentativas - abortando"
    exit 1
  fi
  >&2 echo "Postgres não está disponível - tentativa $counter de $max_retries"
  sleep 1
done

>&2 echo "Postgres está pronto!"

echo "Aplicando migrações..."
python manage.py migrate

echo "Iniciando servidor Django..."
exec python manage.py runserver 0.0.0.0:8000
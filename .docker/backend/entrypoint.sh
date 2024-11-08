#!/bin/sh

set -e

echo "Aguardando PostgreSQL..."
until pg_isready -h "db" -p "5432" -U "postgres"; do
  echo "Postgres não está disponível - aguardando..."
  sleep 1
done

echo "Postgres está pronto!"

# Criar banco de dados se não existir
psql -h "db" -U "postgres" <<-EOSQL
    CREATE DATABASE task_manager;
EOSQL

echo "Aplicando migrações..."
python manage.py migrate

echo "Iniciando servidor Django..."
python manage.py runserver 0.0.0.0:8000
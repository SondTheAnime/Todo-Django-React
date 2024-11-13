#!/bin/sh

set -e

echo "Aguardando PostgreSQL..."
until PGPASSWORD=postgres pg_isready -h "db" -p "5432" -U "postgres"; do
  echo "Postgres não está disponível - aguardando..."
  sleep 1
done

echo "Postgres está pronto!"

# Criar banco de dados se não existir
PGPASSWORD=postgres psql -h "db" -U "postgres" <<-EOSQL
    CREATE DATABASE task_manager;
EOSQL

echo "Aplicando migrações..."
python manage.py migrate

# Criar superusuário
python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='joaovictorbrtor2@gmail.com').exists():
    User.objects.create_superuser(
        username='Sond',
        email='joaovictorbrtor2@gmail.com',
        password='admin123'
    )
END

echo "Iniciando servidor Django..."
python manage.py runserver 0.0.0.0:8000
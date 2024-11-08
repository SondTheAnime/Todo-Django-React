#!/bin/sh

set -e

echo "Aplicando migrações..."
python manage.py migrate

echo "Iniciando servidor..."
exec python manage.py runserver 0.0.0.0:8000
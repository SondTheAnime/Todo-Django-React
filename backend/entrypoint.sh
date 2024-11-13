#!/bin/sh

# Aguarda o banco de dados
echo "Aguardando banco de dados..."
while ! nc -z db 5432; do
    sleep 0.1
done
echo "Banco de dados pronto"

# Aplica migrações
python manage.py migrate

# Cria superusuário
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

python manage.py makemigrations
python manage.py migrate

# Inicia o servidor
python manage.py runserver 0.0.0.0:8000
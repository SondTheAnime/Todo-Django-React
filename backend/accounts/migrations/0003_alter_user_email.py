# Generated by Django 5.1.3 on 2024-11-08 19:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_alter_user_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(error_messages={'unique': 'Um usuário com este email já existe.'}, max_length=254, unique=True, verbose_name='endereço de email'),
        ),
    ]
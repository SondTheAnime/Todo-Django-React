# Generated by Django 5.1.3 on 2024-11-08 19:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={'verbose_name': 'Usuário', 'verbose_name_plural': 'Usuários'},
        ),
    ]
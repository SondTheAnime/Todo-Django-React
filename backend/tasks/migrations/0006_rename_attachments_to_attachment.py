# Generated by Django 5.1.3 on 2024-11-12 01:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0005_task_attachments'),
    ]

    operations = [
        migrations.RenameField(
            model_name='task',
            old_name='attachments',
            new_name='attachment',
        ),
    ]

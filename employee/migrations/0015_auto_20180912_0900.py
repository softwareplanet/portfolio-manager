# Generated by Django 2.1 on 2018-09-12 09:00

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('employee', '0014_auto_20180911_0720'),
    ]

    operations = [
        migrations.RunSQL(
            ('CREATE FULLTEXT INDEX employee_name_index ON employees (first_name, last_name)',
             'CREATE FULLTEXT INDEX projects_index ON projects (name, description)',
             'CREATE FULLTEXT INDEX skills_index ON skills (name)'),
            ('DROP INDEX employee_name_index on employees',
             'DROP INDEX projects_index on employees',
             'DROP INDEX skills_index on employees')
        )
    ]

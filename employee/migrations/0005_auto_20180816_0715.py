# Generated by Django 2.1 on 2018-08-16 07:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('employee', '0004_auto_20180815_1002'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='employee',
            options={},
        ),
        migrations.AlterModelTable(
            name='employee',
            table='employees',
        ),
        migrations.AlterModelTable(
            name='employeeproject',
            table='employee_projects',
        ),
        migrations.AlterModelTable(
            name='employeeschool',
            table='employee_schools',
        ),
        migrations.AlterModelTable(
            name='employeeskill',
            table='employee_skills',
        ),
        migrations.AlterModelTable(
            name='project',
            table='projects',
        ),
        migrations.AlterModelTable(
            name='school',
            table='schools',
        ),
        migrations.AlterModelTable(
            name='skill',
            table='skills',
        ),
    ]
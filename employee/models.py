from django.db import models


class Skill(models.Model):
    name = models.CharField(max_length=150)
    url = models.CharField(max_length=255)


class EmployeeSkill(models.Model):
    employee_id = models.ForeignKey('Employee', on_delete=models.CASCADE)
    skill_id = models.ForeignKey(Skill, on_delete=models.CASCADE)
    level = models.PositiveIntegerField()
    description = models.TextField()


class Project(models.Model):
    start_date = models.DateField()
    duration_months = models.PositiveIntegerField()
    name = models.CharField(max_length=30)
    description = models.TextField()
    url = models.CharField(max_length=30)


class EmployeeProject(models.Model):
    start_date = models.DateField()
    duration_months = models.PositiveIntegerField()
    employee_id = models.ForeignKey('Employee', on_delete=models.CASCADE)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)


class School(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()


class EmployeeSchool(models.Model):
    start_date = models.DateField()
    duration_years = models.PositiveIntegerField()
    employee_id = models.ForeignKey('Employee', on_delete=models.CASCADE)
    school_id = models.ForeignKey(School, on_delete=models.CASCADE)


class Employee(models.Model):
    email = models.EmailField(max_length=50)
    password = models.CharField(max_length=30)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    dob = models.CharField(max_length=30)
    skills = models.ManyToManyField(Skill, through='EmployeeSkill')
    projects = models.ManyToManyField(Project, through='EmployeeProject')
    school = models.ManyToManyField(School, through='EmployeeSchool')

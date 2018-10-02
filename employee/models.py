from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


class SkillCategory(models.Model):
    name = models.CharField(max_length=64)

    class Meta:
        db_table = 'skill_categories'


class Skill(models.Model):
    name = models.CharField(max_length=150)
    url = models.CharField(max_length=255, blank=True)
    category = models.ForeignKey(SkillCategory, on_delete=models.CASCADE, default=3)

    class Meta:
        db_table = 'skills'


class EmployeeSkill(models.Model):
    employee_id = models.ForeignKey('Employee', on_delete=models.CASCADE)
    skill_id = models.ForeignKey(Skill, on_delete=models.CASCADE)
    level = models.PositiveIntegerField()
    description = models.TextField(blank=True)

    class Meta:
        db_table = 'employee_skills'


def project_directory_path(instance, filename):
    return 'projects_files/{0}/{1}/{2}'.format(instance.project.id, instance.group, filename)


class FilesGroup(models.Model):
    name = models.CharField(max_length=64)

    class Meta:
        db_table = 'files_groups'


class ProjectFile(models.Model):
    project = models.ForeignKey('Project', on_delete=models.CASCADE)
    group = models.ForeignKey('FilesGroup', on_delete=models.CASCADE)
    file = models.FileField(upload_to=project_directory_path)

    class Meta:
        db_table = 'project_files'


class Project(models.Model):
    start_date = models.DateField()
    duration_months = models.PositiveIntegerField()
    name = models.CharField(max_length=30)
    description = models.TextField(blank=True)
    url = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = 'projects'


class EmployeeProject(models.Model):
    start_date = models.DateField()
    duration_months = models.PositiveIntegerField()
    employee_id = models.ForeignKey('Employee', on_delete=models.CASCADE)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    skills = models.ManyToManyField(Skill)
    description = models.TextField(blank=True)

    class Meta:
        db_table = 'employee_projects'


class School(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()

    class Meta:
        db_table = 'schools'


class EmployeeSchool(models.Model):
    start_date = models.DateField()
    duration_years = models.PositiveIntegerField()
    employee_id = models.ForeignKey('Employee', on_delete=models.CASCADE)
    school_id = models.ForeignKey(School, on_delete=models.CASCADE)

    class Meta:
        db_table = 'employee_schools'


class Employee(AbstractUser):
    dob = models.DateField(max_length=30)
    skills = models.ManyToManyField(Skill, through='EmployeeSkill')
    projects = models.ManyToManyField(Project, through='EmployeeProject')
    school = models.ManyToManyField(School, through='EmployeeSchool')
    image = models.ImageField(upload_to='profile_images', blank=True)
    description = models.TextField(blank=True)
    career_start_date = models.DateField(blank=True, max_length=30, null=True)
    position = models.CharField(blank=True, max_length=100)

    class Meta:
        db_table = 'employees'


@receiver(post_save, sender=Employee)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

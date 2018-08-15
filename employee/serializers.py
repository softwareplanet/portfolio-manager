from employee.models import Employee, Project, EmployeeProject, Skill, School, EmployeeSkill, EmployeeSchool
from rest_framework import serializers


class EmployeeSerializer(serializers.HyperlinkedModelSerializer):
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Employee
        fields = ('id', 'email', 'password', 'firstName', 'lastName', 'dob')


class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    durationMonths = serializers.IntegerField(source='duration_months', min_value=0)
    startDate = serializers.DateField(source='start_date')

    class Meta:
        model = Project
        fields = ('id', 'startDate', 'durationMonths', 'name', 'description', 'url')


class SkillSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Skill
        fields = ('id', 'name', 'url')


class SchoolSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = School
        fields = ('id', 'name', 'description')


class EmployeeProjectSerializer(serializers.HyperlinkedModelSerializer):
    durationMonths = serializers.IntegerField(source='duration_months', min_value=0)
    startDate = serializers.DateField(source='start_date')
    project = ProjectSerializer(read_only=True, source='project_id')
    employeeId = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Employee.objects.all(),
        source='employee_id',
        required=True
    )
    projectId = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Project.objects.all(),
        source='project_id',
        required=True
    )

    class Meta:
        model = EmployeeProject
        fields = ('id', 'startDate', 'durationMonths', 'project', 'employeeId', 'projectId')


class EmployeeSkillSerializer(serializers.HyperlinkedModelSerializer):
    skill = SkillSerializer(read_only=True, source='skill_id')
    employeeId = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Employee.objects.all(),
        source='employee_id',
        required=True
    )
    skillId = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Skill.objects.all(),
        source='skill_id',
        required=True
    )

    class Meta:
        model = EmployeeSkill
        fields = ('id', 'description', 'level', 'skill', 'employeeId', 'skillId')


class EmployeeSchoolSerializer(serializers.HyperlinkedModelSerializer):
    durationYears = serializers.IntegerField(source='duration_years', min_value=0)
    startDate = serializers.DateField(source='start_date')
    school = SchoolSerializer(read_only=True, source='school_id')
    employeeId = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Employee.objects.all(),
        source='employee_id',
        required=True
    )
    schoolId = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=School.objects.all(),
        source='school_id',
        required=True
    )

    class Meta:
        model = EmployeeSchool
        fields = ('id', 'startDate', 'durationYears', 'school', 'employeeId', 'schoolId')

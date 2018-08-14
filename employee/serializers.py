from employee.models import Employee, Project, EmployeeProject
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


class EmployeeProjectSerializer(serializers.HyperlinkedModelSerializer):
    durationMonths = serializers.IntegerField(source='duration_months', min_value=0)
    startDate = serializers.DateField(source='start_date')
    project = ProjectSerializer(read_only=True, source='project_id')
    employeeId = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Employee.objects.all(),
        source='employee_id'
    )
    projectId = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Project.objects.all(),
        source='project_id'
    )

    class Meta:
        model = EmployeeProject
        fields = ('id', 'startDate', 'durationMonths', 'project', 'employeeId', 'projectId')

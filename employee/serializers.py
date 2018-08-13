from employee.models import Employee
from rest_framework import serializers


class EmployeeSerializer(serializers.HyperlinkedModelSerializer):
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')

    class Meta:
        model = Employee
        fields = ('id', 'email', 'firstName', 'lastName', 'dob', 'skills', 'school', 'projects')

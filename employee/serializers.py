from employee.models import Employee
from rest_framework import serializers


class EmployeeSerializer(serializers.HyperlinkedModelSerializer):
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Employee
        fields = ('id', 'email', 'password', 'firstName', 'lastName', 'dob')

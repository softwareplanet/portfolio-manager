from rest_framework import serializers

from employee.models import Employee, Project, Skill


class SearchEmployeeSerializer(serializers.HyperlinkedModelSerializer):
    firstName = serializers.CharField(source='first_name', required=True)
    lastName = serializers.CharField(source='last_name', required=True)

    def to_representation(self, obj):
        data = super().to_representation(obj)
        data['type'] = 'employee'
        return data

    class Meta:
        model = Employee
        fields = ('id', 'firstName', 'lastName', 'image')


class SearchProjectSerializer(serializers.HyperlinkedModelSerializer):

    def to_representation(self, obj):
        data = super().to_representation(obj)
        data['type'] = 'project'
        return data

    class Meta:
        model = Project
        fields = ('id', 'name', 'description')


class SearchSkillSerializer(serializers.HyperlinkedModelSerializer):

    def to_representation(self, obj):
        data = super().to_representation(obj)
        data['type'] = 'skill'
        return data

    class Meta:
        model = Skill
        fields = ('id', 'name', 'url')

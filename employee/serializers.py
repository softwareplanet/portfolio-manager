from rest_framework import serializers

from employee.models import Employee, Project, EmployeeProject, Skill, School, EmployeeSkill, EmployeeSchool


class EmployeeSerializer(serializers.HyperlinkedModelSerializer):
    firstName = serializers.CharField(source='first_name', required=True)
    lastName = serializers.CharField(source='last_name', required=True)
    password = serializers.CharField(write_only=True, required=True)
    isStaff = serializers.BooleanField(read_only=True, source='is_staff')

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance

    class Meta:
        model = Employee
        fields = (
            'id', 'username', 'email', 'password', 'firstName', 'lastName', 'dob', 'isStaff', 'image', 'description')


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


class EmployeeSkillSerializer(serializers.HyperlinkedModelSerializer):
    skill = SkillSerializer(read_only=True, source='skill_id')
    level = serializers.IntegerField(min_value=1, max_value=5)
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


class EmployeeProjectSerializer(serializers.ModelSerializer):
    durationMonths = serializers.IntegerField(source='duration_months', min_value=0)
    startDate = serializers.DateField(source='start_date')
    project = ProjectSerializer(read_only=True, source='project_id')
    skills = SkillSerializer(many=True, read_only=True)
    skillIds = serializers.PrimaryKeyRelatedField(
        write_only=True,
        many=True,
        source='skills',
        queryset=Skill.objects.all(),
        required=True
    )
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
        fields = ('id', 'startDate', 'durationMonths', 'project', 'skills', 'employeeId', 'projectId', 'skillIds')


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

from rest_framework import serializers

from employee.models import Employee, Project, EmployeeProject, Skill, School, EmployeeSkill, EmployeeSchool, \
    SkillCategory, ProjectFile, FilesGroup, EmployeeFile


class EmployeeSerializer(serializers.HyperlinkedModelSerializer):
    firstName = serializers.CharField(source='first_name', required=True)
    lastName = serializers.CharField(source='last_name', required=True)
    careerStartDate = serializers.CharField(source='career_start_date', required=False)
    password = serializers.CharField(write_only=True, required=True)
    isStaff = serializers.BooleanField(source='is_staff', required=False)
    skills = serializers.SerializerMethodField(read_only=True)
    projects = serializers.SerializerMethodField()

    @staticmethod
    def validate_password(value):
        from django.contrib.auth.password_validation import validate_password
        validate_password(value)
        return value

    @staticmethod
    def get_skills(obj):
        return [skill.name for skill in obj.skills.all()]

    @staticmethod
    def get_projects(obj):
        projects = []
        for project in obj.projects.distinct():
            projects.append(project.name)
        return projects

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
            'id', 'username', 'email', 'password', 'firstName', 'lastName', 'dob',
            'isStaff', 'image', 'description', 'skills', 'projects', 'careerStartDate', 'position'
        )


class EmployeeForUserSerializer(EmployeeSerializer):
    isStaff = serializers.BooleanField(read_only=True, source='is_staff')

    class Meta(EmployeeSerializer.Meta):
        fields = (
            'id', 'username', 'email', 'password', 'firstName', 'lastName', 'dob',
            'isStaff', 'image', 'skills', 'projects', 'careerStartDate', 'position'
        )


class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    durationMonths = serializers.IntegerField(source='duration_months')
    startDate = serializers.DateField(source='start_date')
    isFinished = serializers.BooleanField(source='is_finished')
    skills = serializers.SerializerMethodField()

    @staticmethod
    def get_skills(project):
        arr = []
        for skill in Skill.objects.raw("""
        select * from pman.employee_projects_skills
            where employeeproject_id in (select id from pman.employee_projects
                                            where project_id_id=%s)
            group by skill_id
                                            """,
                                       [project.id]):
            arr.append(skill.skill_id)
        return arr

    class Meta:
        model = Project
        fields = ('id', 'startDate', 'durationMonths', 'name', 'description', 'url', 'skills', 'isFinished')


class SkillCategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SkillCategory
        fields = ('id', 'name')


class SkillSerializer(serializers.HyperlinkedModelSerializer):
    category = SkillCategorySerializer(read_only=True)
    categoryId = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=SkillCategory.objects.all(),
        source='category',
        required=True
    )

    class Meta:
        model = Skill
        fields = ('id', 'name', 'url', 'category', 'categoryId')


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
    projectsCount = serializers.SerializerMethodField(method_name='get_projects_count')

    @staticmethod
    def get_projects_count(obj):
        return EmployeeProject.objects.filter(employee_id=obj.employee_id,
                                              skills=Skill.objects.get(id=obj.skill_id.id)).count()

    class Meta:
        model = EmployeeSkill
        fields = ('id', 'description', 'level', 'skill', 'employeeId', 'skillId', 'projectsCount')


class EmployeeProjectSerializer(serializers.ModelSerializer):
    durationMonths = serializers.IntegerField(source='duration_months')
    startDate = serializers.DateField(source='start_date')
    project = ProjectSerializer(read_only=True, source='project_id')
    skills = SkillSerializer(many=True, read_only=True)
    isFinished = serializers.BooleanField(source='is_finished')
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
        fields = (
            'id', 'startDate', 'durationMonths', 'project', 'skills',
            'employeeId', 'projectId', 'skillIds', 'description', 'isFinished',
        )


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


class EmployeeOnProjectSerializer(EmployeeProjectSerializer):
    employeeName = serializers.SerializerMethodField(method_name='get_employee_name')
    employeeId = serializers.SerializerMethodField(method_name='get_employee_id')
    image = serializers.SerializerMethodField()

    @staticmethod
    def get_image(obj):
        if obj.employee_id.image:
            return obj.employee_id.image.url
        else:
            return None

    @staticmethod
    def get_employee_name(obj):
        return obj.employee_id.first_name + ' ' + obj.employee_id.last_name

    @staticmethod
    def get_employee_id(obj):
        return obj.employee_id.id

    class Meta(EmployeeProjectSerializer.Meta):
        fields = ('id', 'startDate', 'durationMonths', 'skills', 'description', 'employeeName', 'employeeId', 'image')


class FilesGroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = FilesGroup
        fields = ('id', 'name')


class ProjectFileSerializer(serializers.HyperlinkedModelSerializer):
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    group = FilesGroupSerializer(read_only=True)
    groupId = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=FilesGroup.objects.all(),
        source='group',
        required=True
    )

    class Meta:
        model = ProjectFile
        fields = ('id', 'project', 'file', 'groupId', 'group')


class EmployeeFileSerializer(serializers.HyperlinkedModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    group = FilesGroupSerializer(read_only=True)
    groupId = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=FilesGroup.objects.all(),
        source='group',
        required=True
    )

    class Meta:
        model = EmployeeFile
        fields = ('id', 'employee', 'file', 'groupId', 'group', 'comment')


class ExtendedProjectSerializer(ProjectSerializer):
    team = serializers.SerializerMethodField(method_name='get_project_team', read_only=True)
    files = ProjectFileSerializer(many=True, read_only=True, source='project_files')
    skills = serializers.SerializerMethodField()

    @staticmethod
    def get_skills(project):
        skills_list = Skill.objects.filter(employeeproject__project_id=project.id).distinct()
        skills = SkillSerializer(skills_list, many=True)
        return skills.data

    @staticmethod
    def get_project_team(obj):
        return EmployeeOnProjectSerializer(EmployeeProject.objects.filter(project_id=obj.id), many=True).data

    class Meta(ProjectSerializer.Meta):
        fields = ProjectSerializer.Meta.fields + ('team', 'files')


class EmployeeWithSkillSerializer(EmployeeSkillSerializer):
    employeeName = serializers.SerializerMethodField(method_name='get_employee_name')
    employeeId = serializers.SerializerMethodField(method_name='get_employee_id')

    @staticmethod
    def get_employee_name(obj):
        return obj.employee_id.first_name + ' ' + obj.employee_id.last_name

    @staticmethod
    def get_employee_id(obj):
        return obj.employee_id.id

    class Meta(EmployeeSkillSerializer.Meta):
        fields = ('id', 'level', 'description', 'projectsCount', 'employeeName', 'employeeId')


class ExtendedSkillSerializer(SkillSerializer):
    employees = serializers.SerializerMethodField(method_name='get_employees_with_skill', read_only=True)

    @staticmethod
    def get_employees_with_skill(obj):
        return EmployeeWithSkillSerializer(EmployeeSkill.objects.filter(skill_id=obj.id), many=True).data

    class Meta(SkillSerializer.Meta):
        fields = SkillSerializer.Meta.fields + ('employees',)


class EmployeeFromSchoolSerializer(EmployeeSchoolSerializer):
    employeeName = serializers.SerializerMethodField(method_name='get_employee_name')
    employeeId = serializers.SerializerMethodField(method_name='get_employee_id')

    @staticmethod
    def get_employee_name(obj):
        return obj.employee_id.first_name + ' ' + obj.employee_id.last_name

    @staticmethod
    def get_employee_id(obj):
        return obj.employee_id.id

    class Meta(EmployeeSchoolSerializer.Meta):
        fields = ('id', 'durationYears', 'startDate', 'employeeName', 'employeeId')


class ExtendedSchoolSerializer(SkillSerializer):
    employees = serializers.SerializerMethodField(method_name='get_employees_from_school', read_only=True)

    @staticmethod
    def get_employees_from_school(obj):
        return EmployeeFromSchoolSerializer(EmployeeSchool.objects.filter(school_id=obj.id), many=True).data

    class Meta(SchoolSerializer.Meta):
        fields = SchoolSerializer.Meta.fields + ('employees',)


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        from django.contrib.auth.password_validation import validate_password
        validate_password(value)
        return value

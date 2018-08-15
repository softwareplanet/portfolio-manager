from employee.model_views import MultipleInstanceAPIView, SingleInstanceAPIView, MultipleEmployeeRelatedInstanceAPIView, \
    SingleEmployeeRelatedInstanceAPIView
from employee.models import Employee, Project, EmployeeProject, School, Skill
from employee.serializers import EmployeeSerializer, ProjectSerializer, EmployeeProjectSerializer, SchoolSerializer, \
    SkillSerializer


class ListEmployees(MultipleInstanceAPIView):
    serializer = EmployeeSerializer
    model = Employee


class ListEmployee(SingleInstanceAPIView):
    serializer = EmployeeSerializer
    model = Employee


class ListProjects(MultipleInstanceAPIView):
    serializer = ProjectSerializer
    model = Project


class ListProject(SingleInstanceAPIView):
    serializer = ProjectSerializer
    model = Project


class ListSkills(MultipleInstanceAPIView):
    serializer = SkillSerializer
    model = Skill


class ListSkill(SingleInstanceAPIView):
    serializer = SkillSerializer
    model = Skill


class ListSchools(MultipleInstanceAPIView):
    serializer = SchoolSerializer
    model = School


class ListSchool(SingleInstanceAPIView):
    serializer = SchoolSerializer
    model = School


class ListEmployeeProjects(MultipleEmployeeRelatedInstanceAPIView):
    serializer = EmployeeProjectSerializer
    model = EmployeeProject


class ListEmployeeProject(SingleEmployeeRelatedInstanceAPIView):
    serializer = EmployeeProjectSerializer
    model = EmployeeProject

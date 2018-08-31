from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from employee.model_views import MultipleInstanceAPIView, SingleInstanceAPIView, \
    MultipleEmployeeRelatedInstanceAPIView, SingleEmployeeRelatedInstanceAPIView
from employee.models import Employee, Project, EmployeeProject, School, Skill, EmployeeSkill, EmployeeSchool
from employee.serializers import EmployeeSerializer, ProjectSerializer, EmployeeProjectSerializer, SchoolSerializer, \
    SkillSerializer, EmployeeSkillSerializer, EmployeeSchoolSerializer
from employee.utils import Utils


class ListEmployees(MultipleInstanceAPIView):
    serializer = EmployeeSerializer
    model = Employee
    permission_classes = ()


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

    def post(self, request, employee_id):
        if self._owner_or_admin(request, employee_id):
            data = request.data
            data['employeeId'] = employee_id
            serializer = self.serializer(data=data)
            if serializer.is_valid():
                serializer.save()
                self.__process_skills(serializer.data['skills'], employee_id)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Utils.error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        else:
            return Utils.error_response("Permission denied", status.HTTP_403_FORBIDDEN)

    @staticmethod
    def __process_skills(skills, user_id):
        for skill in skills:
            try:
                EmployeeSkill.objects.get(skill_id_id=skill['id'], employee_id_id=user_id)
            except ObjectDoesNotExist:
                EmployeeSkill.objects.create(employee_id_id=user_id, skill_id_id=skill['id'], level=1)


class ListEmployeeProject(SingleEmployeeRelatedInstanceAPIView):
    serializer = EmployeeProjectSerializer
    model = EmployeeProject

    def patch(self, request, employee_id, model_id):
        try:
            model = self.model.objects.get(id=model_id, employee_id=employee_id)
            if self._owner_or_admin(request, employee_id):
                serializer = self.serializer(model, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    self.__process_skills(serializer.data['skills'], employee_id)
                    return Response(serializer.data, status.HTTP_200_OK)
                else:
                    return Utils.error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)
            else:
                return Utils.error_response("Permission denied", status.HTTP_403_FORBIDDEN)
        except ObjectDoesNotExist as e:
            return Utils.error_response(e.args, status.HTTP_404_NOT_FOUND)

    @staticmethod
    def __process_skills(skills, user_id):
        for skill in skills:
            try:
                EmployeeSkill.objects.get(skill_id_id=skill['id'], employee_id_id=user_id)
            except ObjectDoesNotExist:
                EmployeeSkill.objects.create(employee_id_id=user_id, skill_id_id=skill['id'], level=1)


class ListEmployeeSkills(MultipleEmployeeRelatedInstanceAPIView):
    serializer = EmployeeSkillSerializer
    model = EmployeeSkill

    def post(self, request, employee_id):
        if self._owner_or_admin(request, employee_id):
            data = request.data
            data['employeeId'] = employee_id
            try:
                EmployeeSkill.objects.get(skill_id=data['skillId'])
                return Utils.error_response({'non_field_errors': ['You already have such skill']}, status.HTTP_400_BAD_REQUEST)
            except ObjectDoesNotExist:
                serializer = self.serializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Utils.error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        else:
            return Utils.error_response("Permission denied", status.HTTP_403_FORBIDDEN)


class ListEmployeeSkill(SingleEmployeeRelatedInstanceAPIView):
    serializer = EmployeeSkillSerializer
    model = EmployeeSkill


class ListEmployeeSchools(MultipleEmployeeRelatedInstanceAPIView):
    serializer = EmployeeSchoolSerializer
    model = EmployeeSchool


class ListEmployeeSchool(SingleEmployeeRelatedInstanceAPIView):
    serializer = EmployeeSchoolSerializer
    model = EmployeeSchool


class ListMe(APIView):
    serializer = EmployeeSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get(self, request):
        return Response(EmployeeSerializer(request.user).data)

    def patch(self, request):
        try:
            model = request.user
            serializer = self.serializer(model, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status.HTTP_200_OK)
            else:
                return Utils.error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist as e:
            return Utils.error_response(e.args, status.HTTP_404_NOT_FOUND)

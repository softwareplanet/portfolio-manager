from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from employee.models import Employee, Project, EmployeeProject
from employee.serializers import EmployeeSerializer, ProjectSerializer, EmployeeProjectSerializer
from employee.utils import Utils


class ListEmployees(APIView):
    serializer = EmployeeSerializer
    model = Employee

    def get(self, request):
        employees = self.model.objects.all()
        return Response(self.serializer(employees, many=True).data)

    def post(self, request):
        serializer = self.serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Utils.error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)


class ListEmployee(APIView):
    serializer = EmployeeSerializer
    model = Employee

    def get(self, request, employee_id):
        try:
            employee = self.model.objects.get(id=employee_id)
            return Response(self.serializer(employee).data)
        except ObjectDoesNotExist as e:
            return Utils.error_response(e.args, status.HTTP_404_NOT_FOUND)

    def patch(self, request, employee_id):
        try:
            employee = self.model.objects.get(id=employee_id)
            serializer = self.serializer(employee, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status.HTTP_200_OK)
            else:
                return Utils.error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist as e:
            return Utils.error_response(e.args, status.HTTP_404_NOT_FOUND)

    def delete(self, request, employee_id):
        try:
            employee = self.model.objects.get(id=employee_id)
            employee.delete()
            return Response({'employee_id': employee_id}, status.HTTP_200_OK)
        except ObjectDoesNotExist as e:
            return Utils.error_response(e.args, status.HTTP_404_NOT_FOUND)


class ListProjects(APIView):
    serializer = ProjectSerializer
    model = Project

    def get(self, request):
        employees = self.model.objects.all()
        return Response(self.serializer(employees, many=True).data)

    def post(self, request):
        serializer = self.serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Utils.error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)


class ListProject(APIView):
    serializer = ProjectSerializer
    model = Project

    def get(self, request, project_id):
        try:
            project = self.model.objects.get(id=project_id)
            return Response(self.serializer(project).data)
        except ObjectDoesNotExist as e:
            return Utils.error_response(e.args, status.HTTP_404_NOT_FOUND)

    def patch(self, request, project_id):
        try:
            project = self.model.objects.get(id=project_id)
            serializer = self.serializer(project, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status.HTTP_200_OK)
            else:
                return Utils.error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist as e:
            return Utils.error_response(e.args, status.HTTP_404_NOT_FOUND)

    def delete(self, request, project_id):
        try:
            project = self.model.objects.get(id=project_id)
            project.delete()
            return Response({'project_id': project_id}, status.HTTP_200_OK)
        except ObjectDoesNotExist as e:
            return Utils.error_response(e.args, status.HTTP_404_NOT_FOUND)


class ListEmployeeProjects(APIView):
    serializer = EmployeeProjectSerializer
    model = EmployeeProject

    def get(self, request, employee_id):
        employee_projects = self.model.objects.filter(employee_id=employee_id)
        return Response(self.serializer(employee_projects, many=True).data)

    def post(self, request, employee_id):
        data = request.data
        data['employeeId'] = employee_id
        serializer = self.serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Utils.error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)
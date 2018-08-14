from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from employee.models import Employee
from employee.serializers import EmployeeSerializer
from employee.utils import Utils


class ListEmployees(APIView):

    def get(self, request):
        employees = Employee.objects.all()
        return Response(EmployeeSerializer(employees, many=True).data)

    def post(self, request):
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Utils.error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)


class ListEmployee(APIView):

    def get(self, request, employee_id):
        try:
            employee = Employee.objects.get(id=employee_id)
            return Response(EmployeeSerializer(employee).data)
        except ObjectDoesNotExist as e:
            return Utils.error_response(e.args, status.HTTP_404_NOT_FOUND)

    def patch(self, request, employee_id):
        try:
            employee = Employee.objects.get(id=employee_id)
            serializer = EmployeeSerializer(employee, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status.HTTP_200_OK)
            else:
                return Utils.error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist as e:
            return Utils.error_response(e.args, status.HTTP_404_NOT_FOUND)

    def delete(self, request, employee_id):
        try:
            employee = Employee.objects.get(id=employee_id)
            employee.delete()
            return Response({'employee_id': employee_id}, status.HTTP_200_OK)
        except ObjectDoesNotExist as e:
            return Utils.error_response(e.args, status.HTTP_404_NOT_FOUND)

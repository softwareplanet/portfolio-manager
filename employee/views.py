from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from employee.models import Employee
from employee.serializers import EmployeeSerializer
from employee.utils import Utils


def get_employee_collection(request):
    if Utils.is_get(request):
        employees = Employee.objects.all()
        return JsonResponse(EmployeeSerializer(employees, many=True).data, safe=False)
    elif Utils.is_post(request):
        serializer = EmployeeSerializer(data=request.body)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def get_employee(request, id):
    if Utils.is_get(request):
        employee = Employee.objects.get(id=id)
        return JsonResponse(EmployeeSerializer(employee).data)


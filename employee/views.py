from django.http import HttpResponse
from django.shortcuts import render

from employee.models import Employee


def index(request):
    employees = Employee.objects.all()
    return render(request, 'form_template.html', {'employee': employees})

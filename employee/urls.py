from django.urls import path

from . import views

urlpatterns = [
    path('', views.ListEmployees.as_view()),
    path('<int:employee_id>', views.ListEmployee.as_view()),
]

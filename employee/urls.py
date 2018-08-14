from django.urls import path

from . import views

urlpatterns = [
    path('employee/', views.ListEmployees.as_view()),
    path('employee/<int:employee_id>', views.ListEmployee.as_view()),
    path('project/', views.ListProjects.as_view()),
    path('project/<int:project_id>', views.ListProject.as_view()),
    path('employee/<int:employee_id>/projects', views.ListEmployeeProjects.as_view())
]

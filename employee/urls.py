from django.urls import path

from . import views

urlpatterns = [
    path('', views.get_employee_collection),
    path('<int:id>', views.get_employee),
]

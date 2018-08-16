from django.contrib.auth.forms import UserCreationForm
from django.forms import ModelForm

from employee.models import Employee


class EmployeeForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = Employee
        fields = UserCreationForm.Meta.fields + ('dob',)

from django.shortcuts import render

from employee.forms import EmployeeForm


def create_user(request):
    if request.method == "POST":
        form = EmployeeForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.save()
    else:
        form = EmployeeForm()
    return render(request, 'user_form.html', {'form': form})

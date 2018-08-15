from django.contrib import admin
from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('api/v1/', include('employee.urls')),
    path('admin/', admin.site.urls),
    path('sign_in/', obtain_auth_token)
]

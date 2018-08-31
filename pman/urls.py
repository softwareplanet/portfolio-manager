from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_swagger.views import get_swagger_view

schema_view = get_swagger_view(title='Portfolio Manager API')

urlpatterns = [
    path('api/v1/', include('employee.urls')),
    path('admin/', admin.site.urls),
    path('login', obtain_auth_token),
    path('api/', schema_view)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

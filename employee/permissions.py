from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        else:
            return request.user.is_staff


class IsAdminOrSelf(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff or request.user.id == request.parser_context['kwargs']['model_id']


class IsPostOrIsAdmin(BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return True
        return request.user and request.user.is_authenticated

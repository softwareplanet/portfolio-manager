from rest_framework.response import Response


class Utils:
    @staticmethod
    def is_get(request):
        return Utils.__check_request_type(request, 'GET')

    @staticmethod
    def is_post(request):
        return Utils.__check_request_type(request, 'POST')

    @staticmethod
    def is_put(request):
        return Utils.__check_request_type(request, 'PUT')

    @staticmethod
    def is_patch(request):
        return Utils.__check_request_type(request, 'PATCH')

    @staticmethod
    def is_delete(request):
        return Utils.__check_request_type(request, 'DELETE')

    @staticmethod
    def __check_request_type(request, method):
        return request.method == method

    @staticmethod
    def error_response(errors, status):
        return Response({'errors': errors}, status)

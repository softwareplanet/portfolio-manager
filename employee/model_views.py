from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from rest_framework import status, serializers, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from employee.utils import Utils


class MultipleInstanceAPIView(APIView):
    serializer = serializers.Serializer
    model = models.Model
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        models = self.model.objects.all()
        return Response(self.serializer(models, many=True).data)

    def post(self, request):
        serializer = self.serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Utils.error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)


class SingleInstanceAPIView(APIView):
    serializer = serializers.Serializer
    model = models.Model
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, model_id):
        try:
            model = self.model.objects.get(id=model_id)
            return Response(self.serializer(model).data)
        except ObjectDoesNotExist as e:
            return Utils.error_response(e.args, status.HTTP_404_NOT_FOUND)

    def patch(self, request, model_id):
        try:
            model = self.model.objects.get(id=model_id)
            serializer = self.serializer(model, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status.HTTP_200_OK)
            else:
                return Utils.error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist as e:
            return Utils.error_response(e.args, status.HTTP_404_NOT_FOUND)

    def delete(self, request, model_id):
        try:
            model = self.model.objects.get(id=model_id)
            model.delete()
            return Response({'id': model_id}, status.HTTP_200_OK)
        except ObjectDoesNotExist as e:
            return Utils.error_response(e.args, status.HTTP_404_NOT_FOUND)


class MultipleEmployeeRelatedInstanceAPIView(APIView):
    serializer = serializers.Serializer
    model = models.Model
    permission_classes = (permissions.IsAuthenticated, )

    def get(self, request, employee_id):
        models = self.model.objects.filter(employee_id=employee_id)
        return Response(self.serializer(models, many=True).data)

    def post(self, request, employee_id):
        data = request.data
        data['employeeId'] = employee_id
        serializer = self.serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Utils.error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)


class SingleEmployeeRelatedInstanceAPIView(APIView):
    serializer = serializers.Serializer
    model = models.Model
    permission_classes = (permissions.IsAuthenticated, )

    def get(self, request, employee_id, model_id):
        try:
            model = self.model.objects.get(id=model_id, employee_id=employee_id)
            return Response(self.serializer(model).data)
        except ObjectDoesNotExist as e:
            return Utils.error_response(e.args, status.HTTP_404_NOT_FOUND)

    def patch(self, request, employee_id, model_id):
        try:
            model = self.model.objects.get(id=model_id, employee_id=employee_id)
            serializer = self.serializer(model, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status.HTTP_200_OK)
            else:
                return Utils.error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist as e:
            return Utils.error_response(e.args, status.HTTP_404_NOT_FOUND)

    def delete(self, request, employee_id, model_id):
        try:
            model = self.model.objects.get(id=model_id, employee_id=employee_id)
            model.delete()
            return Response({'id': model_id}, status.HTTP_200_OK)
        except ObjectDoesNotExist as e:
            return Utils.error_response(e.args, status.HTTP_404_NOT_FOUND)

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from employee.models import Employee
from employee.serializers import EmployeeSerializer

client = APIClient()


class EmployeeTest(APITestCase):

    def setUp(self):
        self.serializer = EmployeeSerializer
        self.user = Employee.objects.create(username='admin', dob='1998-01-01', password='admin')
        self.token = Token.objects.get(user_id=self.user.id)

    def test_get_single_employee_without_authorization(self):
        response = client.get('/api/v1/employee/' + str(self.user.id))
        self.assertAlmostEquals(status.HTTP_401_UNAUTHORIZED, response.status_code)

    def test_get_single_employee_with_authorization(self):
        response = client.get('/api/v1/employee/' + str(self.user.id), HTTP_AUTHORIZATION='Token {}'.format(self.token))
        self.assertAlmostEquals(status.HTTP_200_OK, response.status_code)

from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class cookiesTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        user = User.objects.get(username=request.data['username'])

        refresh = RefreshToken.for_user(user)
        refresh_token = str(refresh)

        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite='None',
            path= '/',
            max_age=86400
        )
        
        del response.data['refresh']

        return response
    
class cookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token is None:
            return Response({'detail':'Refresh token missing'},status=401)

        data = request.data.copy()
        data['refresh'] = refresh_token

        request._full_data = data
        
        return super().post(request, *args, **kwargs)


class protectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        response = {
            'status':'Request was permitted'
        }
        return Response(response)
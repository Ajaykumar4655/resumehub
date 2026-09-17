from django.urls import path
from .views import RegisterView, cookiesTokenObtainPairView, cookieTokenRefreshView, protectedView


urlpatterns = [
    path('register/', RegisterView.as_view(),name='register'),

    path('token/', cookiesTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', cookieTokenRefreshView.as_view(), name='token_refresh'),

    path('protected-view/', protectedView.as_view(), name='protected_view'),

]
from django.urls import path
from .views import resumeView, jdView, resultView, dashboardView, recentHistoryView, ResultView

urlpatterns = [
    path('upload-resume/', resumeView.as_view(), name='upload_resume'),
    path('upload-jd/', jdView.as_view(), name='upload_jd'),
    path('result/', resultView.as_view(), name='result'),
    path('dashboard/', dashboardView.as_view(), name='deshboard'),
    path('recent-history/', recentHistoryView.as_view(), name='recent-history'),
    
    path('result/<int:pk>/', ResultView.as_view(), name='recent-result'),

]
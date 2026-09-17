from django.urls import path
from .views import (
    ResumeTemplateListView,
    ResumeTemplateDetailView,
    UserResumeView,
    UserResumeDetailView,
    GeneratePdfView,
)

urlpatterns = [
    # REST API endpoints requested
    path("resume-templates/", ResumeTemplateListView.as_view(), name="resume-template-list"),
    path("resume-templates/<int:pk>/", ResumeTemplateDetailView.as_view(), name="resume-template-detail"),
    path("resumes/", UserResumeView.as_view(), name="user-resume-list-create"),
    path("resumes/<int:pk>/", UserResumeDetailView.as_view(), name="user-resume-detail"),
    path("resumes/generate-pdf/", GeneratePdfView.as_view(), name="generate-pdf"),

    # Backward-compatible routes
    path("", ResumeTemplateListView.as_view(), name="template-preview"),
    path("template/<int:pk>/", ResumeTemplateDetailView.as_view(), name="live-template"),
    path("generate-pdf/", GeneratePdfView.as_view(), name="legacy-generate-pdf"),
]
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly

from .models import ResumeBuildTemplate, UserResume
from .serializers import (
    ResumeTemplateListSerializer,
    ResumeTemplateDetailSerializer,
    UserResumeSerializer,
)
from .pdf_generator import generate_resume_pdf


class ResumeTemplateListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            templates = ResumeBuildTemplate.objects.filter(is_active=True).order_by("id")
            serializer = ResumeTemplateListSerializer(templates, many=True, context={"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": "Failed to fetch resume templates", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ResumeTemplateDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            template = ResumeBuildTemplate.objects.get(pk=pk, is_active=True)
            serializer = ResumeTemplateDetailSerializer(template, context={"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ResumeBuildTemplate.DoesNotExist:
            return Response({"error": "Template not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(
                {"error": "Failed to fetch template detail", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserResumeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if not request.user.is_authenticated:
            return Response([], status=status.HTTP_200_OK)
        resumes = UserResume.objects.filter(user=request.user).order_by("-updated_at")
        serializer = UserResumeSerializer(resumes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data.copy() if hasattr(request.data, "copy") else dict(request.data)
        serializer = UserResumeSerializer(data=data)
        if serializer.is_valid():
            user = request.user if request.user.is_authenticated else None
            resume = serializer.save(user=user)
            return Response(UserResumeSerializer(resume).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserResumeDetailView(APIView):
    permission_classes = [AllowAny]

    def get_object(self, pk, user):
        try:
            if user.is_authenticated:
                return UserResume.objects.get(pk=pk, user=user)
            return UserResume.objects.get(pk=pk, user__isnull=True)
        except UserResume.DoesNotExist:
            return None

    def get(self, request, pk):
        resume = self.get_object(pk, request.user)
        if not resume:
            return Response({"error": "Resume not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserResumeSerializer(resume)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        resume = self.get_object(pk, request.user)
        if not resume:
            return Response({"error": "Resume not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserResumeSerializer(resume, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        resume = self.get_object(pk, request.user)
        if not resume:
            return Response({"error": "Resume not found"}, status=status.HTTP_404_NOT_FOUND)
        resume.delete()
        return Response({"message": "Resume deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class GeneratePdfView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        if not isinstance(data, dict):
            return Response({"error": "Invalid request body. Expected JSON object."}, status=status.HTTP_400_BAD_REQUEST)

        template_id = data.get("template_id") or data.get("template")
        resume_data = data.get("resume_data")

        if not template_id:
            return Response({"error": "template_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        if resume_data is None:
            return Response({"error": "resume_data is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            template = ResumeBuildTemplate.objects.get(pk=template_id)
        except (ResumeBuildTemplate.DoesNotExist, ValueError):
            return Response({"error": f"Template with id {template_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            pdf_bytes = generate_resume_pdf(template, resume_data)
            response = HttpResponse(pdf_bytes, content_type="application/pdf")
            response["Content-Disposition"] = 'attachment; filename="resume.pdf"'
            response["Access-Control-Expose-Headers"] = "Content-Disposition"
            return response
        except Exception as e:
            return Response(
                {"error": "Failed to generate resume PDF", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# Backwards compatibility aliases
TemaplatePreviews = ResumeTemplateListView
TemplateLiveView = ResumeTemplateDetailView
from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class ResumeBuildTemplate(models.Model):
    name = models.CharField(max_length=255)
    html_content = models.TextField()  
    css_content = models.TextField()   
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    @property
    def html(self):
        return self.html_content

    @property
    def css(self):
        return self.css_content

    @property
    def image(self):
        return self.preview_image


class UserResume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='resumes')
    template = models.ForeignKey(ResumeBuildTemplate, on_delete=models.SET_NULL, null=True, blank=True, related_name='resumes')
    title = models.CharField(max_length=255, default="My Resume", blank=True)
    resume_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        username = self.user.username if self.user else "Anonymous"
        return f"{self.title} ({username})"


# Aliases for flexibility and prompt alignment
ResumeTemplate = ResumeBuildTemplate
Resume = UserResume


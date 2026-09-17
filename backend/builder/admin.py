from django.contrib import admin
from .models import ResumeBuildTemplate, UserResume


@admin.register(ResumeBuildTemplate)
class ResumeBuildTemplateAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "is_active", "created_at", "updated_at"]
    list_filter = ["is_active", "created_at"]
    search_fields = ["name"]
    ordering = ["id"]


@admin.register(UserResume)
class UserResumeAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "user", "template", "created_at", "updated_at"]
    list_filter = ["created_at", "updated_at"]
    search_fields = ["title", "user__username", "user__email"]
    ordering = ["-updated_at"]
from rest_framework import serializers
from .models import ResumeBuildTemplate, UserResume


class ResumeTemplateListSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(source='preview_image', read_only=True)
    html = serializers.CharField(source='html_content', read_only=True)
    css = serializers.CharField(source='css_content', read_only=True)

    class Meta:
        model = ResumeBuildTemplate
        fields = [
            'id',
            'name',
            'image',
            'html_content',
            'html',
            'css_content',
            'css',
            'is_active',
            'created_at',
            'updated_at',
        ]


class ResumeTemplateDetailSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(source='preview_image', read_only=True)
    html = serializers.CharField(source='html_content', read_only=True)
    css = serializers.CharField(source='css_content', read_only=True)

    class Meta:
        model = ResumeBuildTemplate
        fields = [
            'id',
            'name',
            'preview_image',
            'image',
            'html_content',
            'html',
            'css_content',
            'css',
            'is_active',
            'created_at',
            'updated_at',
        ]


class UserResumeSerializer(serializers.ModelSerializer):
    template_id = serializers.PrimaryKeyRelatedField(
        queryset=ResumeBuildTemplate.objects.all(),
        source='template',
        required=False,
        allow_null=True
    )

    class Meta:
        model = UserResume
        fields = [
            'id',
            'user',
            'template',
            'template_id',
            'title',
            'resume_data',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def validate_resume_data(self, value):
        if value is not None and not isinstance(value, dict):
            raise serializers.ValidationError("resume_data must be a valid JSON object.")
        return value


# Backwards compatibility aliases
TemplatePreviewSerializer = ResumeTemplateListSerializer
TemplateLiveSerializer = ResumeTemplateDetailSerializer
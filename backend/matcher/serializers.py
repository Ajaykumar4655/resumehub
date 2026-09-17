from rest_framework import serializers
from .models import ResumeMatchResultModel

class resumeSerializer(serializers.Serializer):
    resume = serializers.FileField()

class jobDesciptionSerializer(serializers.Serializer):
    jobTitle = serializers.CharField()
    company = serializers.CharField()
    jdText = serializers.CharField()

class resultSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeMatchResultModel
        fields = "__all__"
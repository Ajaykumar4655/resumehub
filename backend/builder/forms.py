from django import forms
from .models import ResumeBuildTemplate

class ResumeBuildTemplateForm(forms.ModelForm):
    class Meta:
        model = ResumeBuildTemplate
        fields = ['name','html_content','css_content','preview_image','is_active']
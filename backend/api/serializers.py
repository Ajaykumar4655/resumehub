from rest_framework import serializers
from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only = True, min_length = 8 , style = {'input_type':'password'})
    password2 = serializers.CharField(write_only = True, min_length = 8 , style = {'input_type':'password'})
    class Meta:
        model = User
        fields = ['username','email','password1','password2']

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password2":"Password do not match."})
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password1'],
        )

        return user
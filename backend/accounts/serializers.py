from django.contrib.auth.models import User
from rest_framework import serializers

from .models import PlayerProfile


class PlayerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerProfile
        fields = [
            "display_name",
            "bio",
            "level",
            "xp",
            "gold",
            "strength",
            "intellect",
            "discipline",
            "vitality",
            "creativity",
            "current_streak",
            "longest_streak",
            "created_at",
            "updated_at",
        ]

        # These values are controlled by the backend.
        read_only_fields = [
            "level",
            "xp",
            "gold",
            "strength",
            "intellect",
            "discipline",
            "vitality",
            "creativity",
            "current_streak",
            "longest_streak",
            "created_at",
            "updated_at",
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
        ]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        # Create RPG profile automatically
        PlayerProfile.objects.create(
            user=user,
            display_name=user.username
        )

        return user
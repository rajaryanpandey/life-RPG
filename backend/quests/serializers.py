from rest_framework import serializers

from .models import Quest


class QuestSerializer(serializers.ModelSerializer):

    class Meta:
        model = Quest

        fields = [
            "id",
            "title",
            "description",
            "category",
            "difficulty",
            "xp_reward",
            "completed",
            "created_at",
            "updated_at",
            "completed_at",
        ]

        read_only_fields = [
            "id",
            "xp_reward",
            "completed",
            "created_at",
            "updated_at",
            "completed_at",
        ]
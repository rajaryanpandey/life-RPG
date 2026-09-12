from rest_framework import serializers

from .models import (
    Character,
    Reward,
    InventoryItem,
    Achievement,
    UserAchievement,
)


# ==========================================
# CHARACTER SERIALIZER
# ==========================================

class CharacterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Character

        fields = [
            "id",
            "level",
            "total_xp",
            "gold",
            "strength",
            "intellect",
            "discipline",
            "vitality",
            "creativity",
            "current_streak",
            "longest_streak",
            "last_completion_date",
            "created_at",
            "updated_at",
        ]

        # Game values are controlled by the backend.
        read_only_fields = [
            "id",
            "level",
            "total_xp",
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


# ==========================================
# REWARD SERIALIZER
# ==========================================

class RewardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Reward

        fields = [
            "id",
            "name",
            "description",
            "reward_type",
            "price",
            "icon",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]


# ==========================================
# INVENTORY SERIALIZER
# ==========================================

class InventoryItemSerializer(serializers.ModelSerializer):

    reward = RewardSerializer(read_only=True)

    class Meta:
        model = InventoryItem

        fields = [
            "id",
            "reward",
            "quantity",
            "purchased_at",
        ]

        read_only_fields = [
            "id",
            "reward",
            "quantity",
            "purchased_at",
        ]


# ==========================================
# ACHIEVEMENT SERIALIZER
# ==========================================

class AchievementSerializer(serializers.ModelSerializer):

    class Meta:
        model = Achievement

        fields = [
            "id",
            "name",
            "description",
            "achievement_type",
            "target_value",
            "icon",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]


# ==========================================
# USER ACHIEVEMENT SERIALIZER
# ==========================================

class UserAchievementSerializer(serializers.ModelSerializer):

    # Include the complete achievement information
    achievement = AchievementSerializer(read_only=True)

    class Meta:
        model = UserAchievement

        fields = [
            "id",
            "achievement",
            "unlocked_at",
        ]

        read_only_fields = [
            "id",
            "achievement",
            "unlocked_at",
        ]
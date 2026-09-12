from django.db import transaction

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Character,
    Reward,
    InventoryItem,
    Achievement,
    UserAchievement,
)

from .serializers import (
    CharacterSerializer,
    RewardSerializer,
    InventoryItemSerializer,
    AchievementSerializer,
    UserAchievementSerializer,
)


# ==============================
# CHARACTER
# ==============================

class CharacterView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        character, created = Character.objects.get_or_create(
            user=request.user
        )

        serializer = CharacterSerializer(character)

        return Response(serializer.data)


# ==============================
# REWARDS
# ==============================

class RewardListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        rewards = Reward.objects.all().order_by("price")

        serializer = RewardSerializer(
            rewards,
            many=True
        )

        return Response(serializer.data)


# ==============================
# PURCHASE REWARD
# ==============================

class PurchaseRewardView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):

        try:
            reward = Reward.objects.get(id=pk)

        except Reward.DoesNotExist:
            return Response(
                {"detail": "Reward not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        character, created = Character.objects.get_or_create(
            user=request.user
        )

        # Check whether the user has enough gold
        if character.gold < reward.price:
            return Response(
                {"detail": "Not enough gold."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Deduct gold
        character.gold -= reward.price
        character.save()

        # Add reward to inventory
        inventory_item, created = InventoryItem.objects.get_or_create(
            user=request.user,
            reward=reward
        )

        # If already owned, increase quantity
        if not created:
            inventory_item.quantity += 1
            inventory_item.save()

        return Response(
            {
                "message": "Reward purchased successfully!",

                "reward": RewardSerializer(reward).data,

                "gold_spent": reward.price,

                "remaining_gold": character.gold,

                "inventory_quantity": inventory_item.quantity,
            },
            status=status.HTTP_200_OK
        )


# ==============================
# INVENTORY
# ==============================

class InventoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        inventory = (
            InventoryItem.objects
            .filter(user=request.user)
            .select_related("reward")
            .order_by("-purchased_at")
        )

        serializer = InventoryItemSerializer(
            inventory,
            many=True
        )

        return Response(serializer.data)


# ==============================
# ACHIEVEMENTS
# ==============================

class AchievementListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        achievements = Achievement.objects.all().order_by("id")

        serializer = AchievementSerializer(
            achievements,
            many=True
        )

        return Response(serializer.data)


# ==============================
# UNLOCKED ACHIEVEMENTS
# ==============================

class UserAchievementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        achievements = (
            UserAchievement.objects
            .filter(user=request.user)
            .select_related("achievement")
            .order_by("-unlocked_at")
        )

        serializer = UserAchievementSerializer(
            achievements,
            many=True
        )

        return Response(serializer.data)
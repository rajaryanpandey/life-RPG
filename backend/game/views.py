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
from accounts.models import PlayerProfile

from .serializers import (
    CharacterSerializer,
    RewardSerializer,
    InventoryItemSerializer,
    AchievementSerializer,
    UserAchievementSerializer,
)
from quests.models import Quest, QuestCompletion
from quests.serializers import QuestSerializer

from game.utils import (
    calculate_level,
    get_attribute_for_category,
    calculate_gold_reward,
    update_streak,
    xp_required_for_level,  # NEW
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

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        character, created = Character.objects.get_or_create(
            user=request.user
        )

        # Get the user's profile
        profile, created = PlayerProfile.objects.get_or_create(
            user=request.user,
            defaults={
                "display_name": request.user.username
            }
        )

        # Get user's quests
        quests = Quest.objects.filter(
            user=request.user
        )

        # Calculate quest statistics
        total_quests = quests.count()
        completed_quests = quests.filter(completed=True).count()
        pending_quests = quests.filter(completed=False).count()

        # Get the 5 most recently created quests
        recent_quests = quests.order_by("-created_at")[:5]

        # Get the 5 most recent quest completions
        recent_completions = (
            QuestCompletion.objects
            .filter(user=request.user)
            .select_related("quest")
            .order_by("-completed_at")[:5]
        )

        # Get user's unlocked achievements
        unlocked_achievements = (
            UserAchievement.objects
            .filter(user=request.user)
            .select_related("achievement")
            .order_by("-unlocked_at")[:5]
        )

                # Get user's inventory
        inventory = (
            InventoryItem.objects
            .filter(user=request.user)
            .select_related("reward")
            .order_by("-purchased_at")[:5]
        )

        # Calculate XP required for the next level
        next_level = character.level + 1
        next_level_xp = xp_required_for_level(next_level)

        # XP required for the current level
        current_level_xp = xp_required_for_level(character.level)

        # XP earned inside the current level
        xp_in_level = character.total_xp - current_level_xp

        # XP needed to reach the next level
        xp_for_next_level = (
            next_level_xp - current_level_xp
        )

        # Calculate XP progress percentage
        if xp_for_next_level > 0:
            xp_progress = (
                xp_in_level / xp_for_next_level
            ) * 100
        else:
            xp_progress = 100

        return Response({
            "character": CharacterSerializer(
                character
            ).data,

            "xp_progress": {
                "current_level_xp": current_level_xp,
                "next_level_xp": next_level_xp,
                "xp_in_level": xp_in_level,
                "xp_for_next_level": xp_for_next_level,
                "percentage": round(
                    xp_progress,
                    2
                ),
            },

            "stats": {
                "total_quests": total_quests,
                "completed_quests": completed_quests,
                "pending_quests": pending_quests,
            },

            "recent_quests": QuestSerializer(
                recent_quests,
                many=True
            ).data,

            "recent_completions": [
              {
                    "id": completion.id,

                    # The original quest may have been deleted.
                   "quest_id": completion.quest.id if completion.quest else None,
                   "quest_title": completion.quest.title if completion.quest else "Deleted quest",
                   "category": completion.quest.category if completion.quest else None,
                   "difficulty": completion.quest.difficulty if completion.quest else None,

                   # Historical reward data is always preserved.
                   "xp_earned": completion.xp_earned,
                   "gold_earned": completion.gold_earned,
                   "completed_at": completion.completed_at,
               }
              for completion in recent_completions
              ],

            "unlocked_achievements": UserAchievementSerializer(
                unlocked_achievements,
                many=True
            ).data,

            "achievement_count": UserAchievement.objects.filter(
                user=request.user
            ).count(),
        })
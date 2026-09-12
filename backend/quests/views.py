from django.db import transaction
from django.utils import timezone

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from django.utils import timezone

from .models import Quest, QuestCompletion
from .serializers import QuestSerializer

from game.models import Character
from game.utils import (
    calculate_level,
    get_attribute_for_category,
    calculate_gold_reward,
    update_streak,
    check_achievements,  # NEW

)


class QuestListCreateView(generics.ListCreateAPIView):

    serializer_class = QuestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own quests
        return Quest.objects.filter(
            user=self.request.user
        ).order_by("-created_at")

    def perform_create(self, serializer):
        # Automatically assign the logged-in user
        serializer.save(
            user=self.request.user
        )


class QuestDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = QuestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only access their own quests
        return Quest.objects.filter(
            user=self.request.user
        )

    def perform_update(self, serializer):
        # Completed quests are permanently recorded
        if serializer.instance.completed:
            from rest_framework.exceptions import ValidationError

            raise ValidationError(
                {
                    "detail": "Completed quests cannot be edited."
                }
            )

        serializer.save()


class CompleteQuestView(APIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):

        # Get only the quest belonging to the logged-in user
        try:
            quest = Quest.objects.get(
                id=pk,
                user=request.user
            )

        except Quest.DoesNotExist:
            return Response(
                {
                    "detail": "Quest not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Prevent completing the same quest twice
        if quest.completed:
            return Response(
                {
                    "detail": "Quest has already been completed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get or create the player's character
        character, created = Character.objects.get_or_create(
            user=request.user
        )

        # XP comes from the quest
        xp_earned = quest.xp_reward

        # Calculate gold using backend rules
        gold_earned = calculate_gold_reward(
            quest.xp_reward,
            quest.difficulty
        )

        # Add XP and gold
        character.total_xp += xp_earned
        character.gold += gold_earned

        # Calculate new level
        character.level = calculate_level(
            character.total_xp
        )

        # Find which attribute should increase
        attribute_name = get_attribute_for_category(
            quest.category
        )

        # Update player's daily streak
        today = timezone.localdate()

        update_streak(
         character,
         character.last_completion_date
)

        character.last_completion_date = today

        # Increase that attribute by 1
        current_value = getattr(
            character,
            attribute_name
        )

        setattr(
            character,
            attribute_name,
            current_value + 1
        )

        character.save()
        # Mark quest as completed
        quest.completed = True
        quest.completed_at = timezone.now()
        quest.save()

        # Create permanent completion history
        QuestCompletion.objects.create(
            quest=quest,
            user=request.user,
            xp_earned=xp_earned,
            gold_earned=gold_earned,
        )
        # Check and unlock achievements after updating the character
        check_achievements(
        request.user,
        character
        )

        return Response(
            {
                "message": "Quest completed successfully!",

                "quest": QuestSerializer(
                    quest
                ).data,

                "rewards": {
                    "xp": xp_earned,
                    "gold": gold_earned,
                    "attribute": attribute_name,
                },

                "character": {
                    "level": character.level,
                    "total_xp": character.total_xp,
                    "gold": character.gold,
                    "strength": character.strength,
                    "intellect": character.intellect,
                    "discipline": character.discipline,
                    "vitality": character.vitality,
                    "creativity": character.creativity,

                    "current_streak": character.current_streak,
                    "longest_streak": character.longest_streak,
                },
            },
            status=status.HTTP_200_OK
        )

# ==============================
# QUEST COMPLETION HISTORY
# ==============================

class QuestHistoryView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        history = (
            QuestCompletion.objects
            .filter(user=request.user)
            .select_related("quest")
            .order_by("-completed_at")
        )

        data = []

        for completion in history:
            quest = completion.quest
            data.append(
                {
                    "id": completion.id,
                    "quest_id": completion.quest.id,
                    "quest_title": completion.quest.title,
                    "category": completion.quest.category,
                    "difficulty": completion.quest.difficulty,
                    "xp_earned": completion.xp_earned,
                    "gold_earned": completion.gold_earned,
                    "completed_at": completion.completed_at,
                }
            )

        return Response(data)
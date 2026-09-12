from django.db import models
from django.contrib.auth.models import User


class Quest(models.Model):

    CATEGORY_CHOICES = [
        ("CODING", "Coding"),
        ("STUDY", "Study"),
        ("GYM", "Gym"),
        ("HEALTH", "Health"),
        ("WORK", "Work"),
        ("PERSONAL", "Personal"),
        ("CREATIVE", "Creative"),
        ("OTHER", "Other"),
    ]

    DIFFICULTY_CHOICES = [
        ("EASY", "Easy"),
        ("MEDIUM", "Medium"),
        ("HARD", "Hard"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="quests"
    )

    title = models.CharField(max_length=200)

    description = models.TextField(blank=True)

    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default="OTHER"
    )

    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
        default="EASY"
    )

    xp_reward = models.PositiveIntegerField(default=10)

    completed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    completed_at = models.DateTimeField(
        null=True,
        blank=True
    )

    def __str__(self):
        return self.title


class QuestCompletion(models.Model):

    quest = models.ForeignKey(
        Quest,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="completion_history"
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="quest_completions"
    )

    xp_earned = models.PositiveIntegerField()

    gold_earned = models.PositiveIntegerField()

    completed_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
    # Handle the case where the original quest was deleted
      quest_title = self.quest.title if self.quest else "Deleted quest"
      return f"{self.user.username} completed {quest_title}"
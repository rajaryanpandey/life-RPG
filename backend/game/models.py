from django.db import models
from django.contrib.auth.models import User


# ==========================================
# CHARACTER
# ==========================================

class Character(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="character"
    )

    level = models.PositiveIntegerField(default=1)
    total_xp = models.PositiveIntegerField(default=0)
    gold = models.PositiveIntegerField(default=0)

    strength = models.PositiveIntegerField(default=1)
    intellect = models.PositiveIntegerField(default=1)
    discipline = models.PositiveIntegerField(default=1)
    vitality = models.PositiveIntegerField(default=1)
    creativity = models.PositiveIntegerField(default=1)

    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)

    last_completion_date = models.DateField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Character"


# ==========================================
# REWARD
# ==========================================

class Reward(models.Model):

    REWARD_TYPES = [
        ("ITEM", "Item"),
        ("THEME", "Theme"),
        ("BADGE", "Badge"),
    ]

    name = models.CharField(max_length=100)

    description = models.TextField(blank=True)

    reward_type = models.CharField(
        max_length=20,
        choices=REWARD_TYPES
    )

    price = models.PositiveIntegerField()

    icon = models.CharField(
        max_length=100,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.name


# ==========================================
# INVENTORY
# ==========================================

class InventoryItem(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="inventory"
    )

    reward = models.ForeignKey(
        Reward,
        on_delete=models.CASCADE,
        related_name="owners"
    )

    quantity = models.PositiveIntegerField(
        default=1
    )

    purchased_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "reward"],
                name="unique_user_reward"
            )
        ]

    def __str__(self):
        return f"{self.user.username} - {self.reward.name}"


# ==========================================
# ACHIEVEMENT
# ==========================================

class Achievement(models.Model):

    ACHIEVEMENT_TYPES = [
        ("QUESTS", "Quests"),
        ("STREAK", "Streak"),
        ("XP", "XP"),
        ("GOLD", "Gold"),
    ]

    name = models.CharField(
        max_length=100
    )

    description = models.TextField()

    achievement_type = models.CharField(
        max_length=20,
        choices=ACHIEVEMENT_TYPES
    )

    target_value = models.PositiveIntegerField()

    icon = models.CharField(
        max_length=100,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.name


# ==========================================
# USER ACHIEVEMENT
# ==========================================

class UserAchievement(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="achievements"
    )

    achievement = models.ForeignKey(
        Achievement,
        on_delete=models.CASCADE,
        related_name="unlocked_by"
    )

    unlocked_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "achievement"],
                name="unique_user_achievement"
            )
        ]

    def __str__(self):
        return f"{self.user.username} - {self.achievement.name}"
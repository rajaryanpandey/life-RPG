from django.db import models
from django.contrib.auth.models import User


class PlayerProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    # Basic profile information
    display_name = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)

    # RPG information
    level = models.PositiveIntegerField(default=1)
    xp = models.PositiveIntegerField(default=0)
    gold = models.PositiveIntegerField(default=0)

    # Character attributes
    strength = models.PositiveIntegerField(default=1)
    intellect = models.PositiveIntegerField(default=1)
    discipline = models.PositiveIntegerField(default=1)
    vitality = models.PositiveIntegerField(default=1)
    creativity = models.PositiveIntegerField(default=1)

    # Streak information
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)

    # Account information
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.display_name or self.user.username
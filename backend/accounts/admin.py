from django.contrib import admin
from .models import PlayerProfile


@admin.register(PlayerProfile)
class PlayerProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "display_name",
        "level",
        "xp",
        "gold",
        "current_streak",
        "longest_streak",
    )

    search_fields = (
        "user__username",
        "display_name",
    )
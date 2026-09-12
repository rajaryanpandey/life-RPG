from django.contrib import admin

from .models import Character, Reward, InventoryItem

@admin.register(Character)
class CharacterAdmin(admin.ModelAdmin):

    list_display = (
        "user",
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
    )

    search_fields = (
        "user__username",
    )
@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "reward_type",
        "price",
        "created_at",
    )

    list_filter = (
        "reward_type",
    )

    search_fields = (
        "name",
        "description",
    )


@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):

    list_display = (
        "user",
        "reward",
        "quantity",
        "purchased_at",
    )

    search_fields = (
        "user__username",
        "reward__name",
    )
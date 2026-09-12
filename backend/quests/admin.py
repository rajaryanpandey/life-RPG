from django.contrib import admin
from .models import Quest ,QuestCompletion


@admin.register(Quest)
class QuestAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "user",
        "category",
        "difficulty",
        "xp_reward",
        "completed",
        "created_at",
    )

    list_filter = (
        "category",
        "difficulty",
        "completed",
    )

    search_fields = (
        "title",
        "description",
        "user__username",
    )
@admin.register(QuestCompletion)
class QuestCompletionAdmin(admin.ModelAdmin):

    list_display = (
        "quest",
        "user",
        "xp_earned",
        "gold_earned",
        "completed_at",
    )

    list_filter = (
        "completed_at",
    )

    search_fields = (
        "quest__title",
        "user__username",
    )
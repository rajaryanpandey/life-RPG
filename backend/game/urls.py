from django.urls import path

from .views import (
    CharacterView,
    RewardListView,
    PurchaseRewardView,
    InventoryView,
    AchievementListView,
    UserAchievementView,
)


urlpatterns = [

    path(
        "character/",
        CharacterView.as_view(),
        name="character"
    ),

    path(
        "rewards/",
        RewardListView.as_view(),
        name="reward-list"
    ),

    path(
        "rewards/<int:pk>/purchase/",
        PurchaseRewardView.as_view(),
        name="reward-purchase"
    ),

    path(
        "inventory/",
        InventoryView.as_view(),
        name="inventory"
    ),

    path(
        "achievements/",
        AchievementListView.as_view(),
        name="achievement-list"
    ),

    path(
        "achievements/unlocked/",
        UserAchievementView.as_view(),
        name="user-achievements"
    ),
]
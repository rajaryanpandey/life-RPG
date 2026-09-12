from django.urls import path

from .views import (
    QuestListCreateView,
    QuestDetailView,
    CompleteQuestView,
    QuestHistoryView,
)


urlpatterns = [

    path(
        "",
        QuestListCreateView.as_view(),
        name="quest-list-create"
    ),

    path(
        "<int:pk>/",
        QuestDetailView.as_view(),
        name="quest-detail"
    ),

    path(
        "<int:pk>/complete/",
        CompleteQuestView.as_view(),
        name="quest-complete"
    ),

    path(
    "history/",
    QuestHistoryView.as_view(),
    name="quest-history"
    ),

]
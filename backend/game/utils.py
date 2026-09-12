def xp_required_for_level(level):
    """
    Returns the total XP required to reach a level.

    Higher levels require progressively more XP.
    """

    return 100 * (level - 1) ** 2 + 100


def calculate_level(total_xp):
    """
    Calculate the player's level from their total XP.
    """

    level = 1

    while total_xp >= xp_required_for_level(level + 1):
        level += 1

    return level


def get_attribute_for_category(category):
    """
    Connect a quest category to a character attribute.
    """

    category_attribute_map = {
        "CODING": "intellect",
        "STUDY": "intellect",
        "GYM": "strength",
        "HEALTH": "vitality",
        "WORK": "discipline",
        "PERSONAL": "discipline",
        "CREATIVE": "creativity",
        "OTHER": "discipline",
    }

    return category_attribute_map.get(
        category,
        "discipline"
    )


def calculate_gold_reward(xp_reward, difficulty):
    """
    Calculate gold earned from completing a quest.
    """

    difficulty_multiplier = {
        "EASY": 1,
        "MEDIUM": 2,
        "HARD": 3,
    }

    multiplier = difficulty_multiplier.get(
        difficulty,
        1
    )

    return xp_reward * multiplier // 2

from datetime import date, timedelta


def update_streak(character, last_completion_date):
    """
    Update the player's daily quest completion streak.

    Returns the new current streak.
    """

    today = date.today()

    # First ever completion
    if last_completion_date is None:
        character.current_streak = 1

    # Completed something today
    elif last_completion_date == today:
        # Streak stays the same
        return character.current_streak

    # Completed something yesterday
    elif last_completion_date == today - timedelta(days=1):
        character.current_streak += 1

    # Missed one or more days
    else:
        character.current_streak = 1

    # Update longest streak if necessary
    if character.current_streak > character.longest_streak:
        character.longest_streak = character.current_streak

    return character.current_streak
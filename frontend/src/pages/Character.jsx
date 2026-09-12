import { useEffect, useState } from "react";

import {
    Shield,
    Sparkles,
    Coins,
    Flame,
    Zap,
    Dumbbell,
    Brain,
    Heart,
    Target,
    Palette,
    Loader2,
} from "lucide-react";

import { getCharacter } from "../services/api";

function Character() {
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadCharacter();
    }, []);

    const loadCharacter = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getCharacter();

            setCharacter(response.data);
        } catch (err) {
            console.error(
                "Failed to load character:",
                err
            );

            setError(
                "Unable to load your character. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };
        const level = character?.level || 1;
    const totalXP = character?.total_xp || 0;
    const gold = character?.gold || 0;

    const strength = character?.strength || 1;
    const intellect = character?.intellect || 1;
    const discipline = character?.discipline || 1;
    const vitality = character?.vitality || 1;
    const creativity = character?.creativity || 1;

    const currentStreak =
        character?.current_streak || 0;

    const longestStreak =
        character?.longest_streak || 0;

    let characterTitle = "Novice";

    if (level >= 10) {
        characterTitle = "Legend";
    } else if (level >= 5) {
        characterTitle = "Warrior";
    } else if (level >= 3) {
        characterTitle = "Adventurer";
    }
    if (loading) {
        return (
            <div className="page-container">

                <div className="quest-loading">
                    <Loader2 size={22} />
                    Loading your character...
                </div>

            </div>
        );
    }

    return (
        <div className="page-container">

            <div className="page-header">

                <div>
                    <p className="page-eyebrow">
                        YOUR CHARACTER
                    </p>

                    <h1>
                        Character
                    </h1>

                    <p>
                        Track your progress and see how
                        your real-world actions shape your hero.
                    </p>
                </div>

                <div className="reward-balance">

                    <Coins size={20} />

                    <div>
                        <span>
                            Gold
                        </span>

                        <strong>
                            {gold}
                        </strong>
                    </div>

                </div>

            </div>

            {error && (
                <div className="auth-error">
                    {error}
                </div>
            )}
            <section className="character-section">

                <div className="character-card">

                    <div className="character-background" />

                    <div className="character-content">

                        <div className="character-avatar">
                            <Shield size={42} />
                        </div>

                        <div className="character-info">

                            <span>
                                CHARACTER
                            </span>

                            <h2>
                                Adventurer
                            </h2>

                            <p>
                                Level {level} • {characterTitle}
                            </p>

                        </div>

                        <div className="character-badge">

                            <Sparkles size={15} />

                            Level {level}

                        </div>

                    </div>

                    <div className="character-stats">

                        <div>
                            <span>STR</span>
                            <strong>{strength}</strong>
                        </div>

                        <div>
                            <span>INT</span>
                            <strong>{intellect}</strong>
                        </div>

                        <div>
                            <span>VIT</span>
                            <strong>{vitality}</strong>
                        </div>

                        <div>
                            <span>DIS</span>
                            <strong>{discipline}</strong>
                        </div>

                    </div>

                </div>

            </section>
            <section className="dashboard-section">

                <div className="section-title">

                    <h2>
                        Attributes
                    </h2>

                    <p>
                        Your real-world activities improve
                        different character attributes.
                    </p>

                </div>

                <div className="stats-grid">

                    <div className="stat-card">

                        <div className="stat-icon">
                            <Dumbbell size={20} />
                        </div>

                        <div>
                            <span>
                                Strength
                            </span>

                            <strong>
                                {strength}
                            </strong>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">
                            <Brain size={20} />
                        </div>

                        <div>
                            <span>
                                Intellect
                            </span>

                            <strong>
                                {intellect}
                            </strong>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">
                            <Target size={20} />
                        </div>

                        <div>
                            <span>
                                Discipline
                            </span>

                            <strong>
                                {discipline}
                            </strong>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">
                            <Heart size={20} />
                        </div>

                        <div>
                            <span>
                                Vitality
                            </span>

                            <strong>
                                {vitality}
                            </strong>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">
                            <Palette size={20} />
                        </div>

                        <div>
                            <span>
                                Creativity
                            </span>

                            <strong>
                                {creativity}
                            </strong>
                        </div>

                    </div>

                </div>

            </section>

                <section className="dashboard-grid">

                <div className="xp-panel">

                    <div className="panel-heading">

                        <div>
                            <span className="panel-label">
                                PROGRESSION
                            </span>

                            <h2>
                                Level {level}
                            </h2>
                        </div>

                        <div className="xp-icon">
                            <Zap size={20} />
                        </div>

                    </div>

                    <div className="character-progress-info">

                        <span>
                            Total Experience
                        </span>

                        <strong>
                            {totalXP} XP
                        </strong>

                    </div>

                    <p>
                        Keep completing quests to reach
                        higher levels.
                    </p>

                </div>


                <div className="xp-panel">

                    <div className="panel-heading">

                        <div>
                            <span className="panel-label">
                                STREAK
                            </span>

                            <h2>
                                {currentStreak} days
                            </h2>
                        </div>

                        <div className="xp-icon">
                            <Flame size={20} />
                        </div>

                    </div>

                    <div className="character-progress-info">

                        <span>
                            Longest Streak
                        </span>

                        <strong>
                            {longestStreak} days
                        </strong>

                    </div>

                    <p>
                        Complete quests consistently to
                        maintain your streak.
                    </p>

                </div>

            </section>

        </div>
    );
}

export default Character;
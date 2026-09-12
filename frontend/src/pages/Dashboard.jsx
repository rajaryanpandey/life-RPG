import { useEffect, useState } from "react";

import {
    ArrowRight,
    CheckCircle2,
    Flame,
    Plus,
    Swords,
    Trophy,
    Zap,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import XPBar from "../components/XPBar";
import CharacterCard from "../components/CharacterCard";
import QuestCard from "../components/QuestCard";

import {
    completeQuest,
    getDashboard,
} from "../services/api";

function Dashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getDashboard();

            setDashboard(response.data);

            const questData = Array.isArray(
                response.data.recent_quests
            )
                ? response.data.recent_quests
                : [];

            setQuests(questData);
        } catch (err) {
            console.error(
                "Failed to load dashboard:",
                err
            );

            setError(
                "Unable to load your dashboard. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteQuest = async (questId) => {
        try {
            setError("");

            await completeQuest(questId);

            await loadDashboard();
        } catch (err) {
            console.error(
                "Failed to complete quest:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Unable to complete this quest."
            );
        }
    };
    const character = dashboard?.character;

    const displayName =
        dashboard?.profile?.display_name ||
        "Adventurer";

    const currentLevel =
        character?.level || 1;

    const totalXP =
        character?.total_xp || 0;

    const currentStreak =
        character?.current_streak || 0;

    const xpProgress =
        dashboard?.xp_progress;

    const xpInLevel =
        xpProgress?.xp_in_level || 0;

    const xpForNextLevel =
        xpProgress?.xp_for_next_level || 100;

    const totalQuests =
        dashboard?.stats?.total_quests || 0;

    const completedQuests =
        dashboard?.stats?.completed_quests || 0;

    const activeQuests =
        dashboard?.stats?.pending_quests || 0;

    return (
        <div className="dashboard-page">

            <section className="dashboard-heading">

                <div>
                    <span className="eyebrow">
                        YOUR ADVENTURE
                    </span>

                    <h1>
                        Welcome back, {displayName}
                    </h1>

                    <p>
                        Every day is another opportunity
                        to level up.
                    </p>
                </div>

                <button
                    className="primary-action"
                    onClick={() => navigate("/quests")}
                >
                    <Plus size={18} />
                    Create Quest
                </button>

            </section>

            {error && (
                <div className="auth-error">
                    {error}
                </div>
            )}

            <section className="dashboard-grid">

                <CharacterCard
                    character={character}
                    displayName={displayName}
                />

                <div className="xp-panel">

                    <div className="panel-heading">

                        <div>
                            <span className="panel-label">
                                EXPERIENCE
                            </span>

                            <h2>
                                Level {currentLevel}
                            </h2>
                        </div>

                        <div className="xp-icon">
                            <Zap size={20} />
                        </div>

                    </div>

                    <XPBar
                        currentXP={xpInLevel}
                        requiredXP={xpForNextLevel}
                    />

                    <div className="xp-footer">

                        <span>
                            {xpInLevel} XP
                        </span>

                        <span>
                            {xpForNextLevel} XP
                        </span>

                    </div>

                    <div className="next-level">

                        <span>
                            {Math.max(
                                xpForNextLevel - xpInLevel,
                                0
                            )}{" "}
                            XP until Level{" "}
                            {currentLevel + 1}
                        </span>

                        <span>
                            Keep going!
                        </span>

                    </div>

                </div>

            </section>

            <section className="stats-grid">

                <div className="stat-card">

                    <div className="stat-icon">
                        <Swords size={20} />
                    </div>

                    <div>
                        <span>
                            Active Quests
                        </span>

                        <strong>
                            {activeQuests}
                        </strong>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        <CheckCircle2 size={20} />
                    </div>

                    <div>
                        <span>
                            Completed
                        </span>

                        <strong>
                            {completedQuests}
                        </strong>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        <Flame size={20} />
                    </div>

                    <div>
                        <span>
                            Current Streak
                        </span>

                        <strong>
                            {currentStreak} days
                        </strong>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        <Trophy size={20} />
                    </div>

                    <div>
                        <span>
                            Total XP
                        </span>

                        <strong>
                            {totalXP}
                        </strong>
                    </div>

                </div>

            </section>

            <section className="dashboard-section">

                <div className="section-heading">

                    <div>
                        <span className="panel-label">
                            YOUR ADVENTURE
                        </span>

                        <h2>
                            Your Quests
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="view-all"
                        onClick={() => navigate("/quests")}
                    >
                        View all
                        <ArrowRight size={16} />
                    </button>

                </div>

                {loading ? (

                    <div className="quest-loading">
                        Loading your quests...
                    </div>

                ) : quests.length === 0 ? (

                    <div className="quest-empty">

                        <Swords size={28} />

                        <h3>
                            No quests yet
                        </h3>

                        <p>
                            Your adventure is waiting to begin.
                        </p>

                    </div>

                ) : (

                    <div className="quest-grid">

                        {quests.map((quest) => (
                            <QuestCard
                                key={quest.id}
                                quest={quest}
                                onComplete={
                                    handleCompleteQuest
                                }
                            />
                        ))}

                    </div>

                )}

            </section>
            </div>
    );
}

export default Dashboard;
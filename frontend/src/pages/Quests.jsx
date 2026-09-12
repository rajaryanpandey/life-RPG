import { useEffect, useState } from "react";
import { Plus, Swords } from "lucide-react";

import QuestCard from "../components/QuestCard";

import {
    getQuests,
    createQuest,
    completeQuest,
    updateQuest,
    deleteQuest,
} from "../services/api";

function Quests() {
    const [quests, setQuests] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "OTHER",
        difficulty: "EASY",
    });

    useEffect(() => {
        loadQuests();
    }, []);

    const loadQuests = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getQuests();

            setQuests(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (err) {
            console.error("Failed to load quests:", err);

            setError(
                "Unable to load your quests. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            category: "OTHER",
            difficulty: "EASY",
        });
    };

    const handleCreateQuest = async (event) => {
        event.preventDefault();

        if (!formData.title.trim()) {
            setError("Please enter a quest title.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            await createQuest({
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category,
                difficulty: formData.difficulty,
            });

            resetForm();
            setShowForm(false);

            setSuccess("Quest created successfully!");

            await loadQuests();
        } catch (err) {
            console.error(
                "Failed to create quest:",
                err
            );

            const responseData = err.response?.data;

            if (responseData?.title) {
                setError(responseData.title[0]);
            } else if (responseData?.detail) {
                setError(responseData.detail);
            } else {
                setError(
                    "Unable to create quest. Please try again."
                );
            }
        } finally {
            setSaving(false);
        }
    };
    const handleCompleteQuest = async (questId) => {
        try {
            setError("");
            setSuccess("");

            await completeQuest(questId);

            setSuccess(
                "Quest completed! XP and rewards have been added."
            );

            await loadQuests();
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

    const handleEditQuest = async (quest) => {
        if (quest.completed) {
            setError(
                "Completed quests cannot be edited."
            );
            return;
        }

        const newTitle = window.prompt(
            "Enter the new quest title:",
            quest.title
        );

        if (newTitle === null) {
            return;
        }

        if (!newTitle.trim()) {
            setError("Quest title cannot be empty.");
            return;
        }

        try {
            setError("");
            setSuccess("");

            await updateQuest(quest.id, {
                title: newTitle.trim(),
            });

            setSuccess("Quest updated successfully!");

            await loadQuests();
        } catch (err) {
            console.error(
                "Failed to update quest:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Unable to update this quest."
            );
        }
    };

    const handleDeleteQuest = async (questId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this quest?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await deleteQuest(questId);

            setSuccess("Quest deleted successfully!");

            await loadQuests();
        } catch (err) {
            console.error(
                "Failed to delete quest:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Unable to delete this quest."
            );
        }
    };
    const activeQuests = quests.filter(
        (quest) => !quest.completed
    );

    const completedQuests = quests.filter(
        (quest) => quest.completed
    );

    return (
        <div className="dashboard-page">

            <section className="dashboard-heading">

                <div>
                    <span className="eyebrow">
                        YOUR ADVENTURE
                    </span>

                    <h1>
                        Quests
                    </h1>

                    <p>
                        Turn your real-world goals into
                        rewarding adventures.
                    </p>
                </div>

                <button
                    type="button"
                    className="primary-action"
                    onClick={() => {
                        setShowForm((previous) => !previous);
                        setError("");
                        setSuccess("");
                    }}
                >
                    <Plus size={18} />

                    {showForm
                        ? "Close"
                        : "Create Quest"}
                </button>

            </section>

            {error && (
                <div className="auth-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="auth-success">
                    {success}
                </div>
            )}
                {showForm && (
                <section className="dashboard-section">

                    <div className="section-heading">
                        <div>
                            <span className="panel-label">
                                NEW ADVENTURE
                            </span>

                            <h2>
                                Create a Quest
                            </h2>
                        </div>
                    </div>

                    <form
                        className="quest-form"
                        onSubmit={handleCreateQuest}
                    >

                        <div className="form-group">
                            <label htmlFor="title">
                                Quest Title
                            </label>

                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Complete React project"
                                maxLength={200}
                                required
                            />
                        </div>


                        <div className="form-group">
                            <label htmlFor="description">
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your quest..."
                                rows={4}
                            />
                        </div>


                        <div className="form-row">

                            <div className="form-group">
                                <label htmlFor="category">
                                    Category
                                </label>

                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="CODING">
                                        Coding
                                    </option>

                                    <option value="STUDY">
                                        Study
                                    </option>

                                    <option value="GYM">
                                        Gym
                                    </option>

                                    <option value="HEALTH">
                                        Health
                                    </option>

                                    <option value="WORK">
                                        Work
                                    </option>

                                    <option value="PERSONAL">
                                        Personal
                                    </option>

                                    <option value="CREATIVE">
                                        Creative
                                    </option>

                                    <option value="OTHER">
                                        Other
                                    </option>
                                </select>
                            </div>


                            <div className="form-group">
                                <label htmlFor="difficulty">
                                    Difficulty
                                </label>

                                <select
                                    id="difficulty"
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleChange}
                                >
                                    <option value="EASY">
                                        Easy
                                    </option>

                                    <option value="MEDIUM">
                                        Medium
                                    </option>

                                    <option value="HARD">
                                        Hard
                                    </option>
                                </select>
                            </div>

                        </div>


                        <button
                            type="submit"
                            className="primary-action"
                            disabled={saving}
                        >
                            <Plus size={18} />

                            {saving
                                ? "Creating..."
                                : "Create Quest"}
                        </button>

                    </form>

                </section>
            )}
                <section className="dashboard-section">

                <div className="section-heading">

                    <div>
                        <span className="panel-label">
                            ACTIVE ADVENTURES
                        </span>

                        <h2>
                            Your Quests
                        </h2>
                    </div>

                    <span className="panel-label">
                        {activeQuests.length} active
                    </span>

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
                            Create your first quest and
                            begin your adventure.
                        </p>

                    </div>

                ) : (

                    <div className="quest-grid">

                        {quests.map((quest) => (
                            <div
                                key={quest.id}
                                className="quest-item-wrapper"
                            >
                                <QuestCard
                                    quest={quest}
                                    onComplete={
                                        handleCompleteQuest
                                    }
                                />

                                {!quest.completed && (
                                    <div className="quest-actions">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEditQuest(
                                                    quest
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteQuest(
                                                    quest.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>
                                )}

                            </div>
                        ))}

                    </div>

                )}

            </section>

                {completedQuests.length > 0 && (
                <section className="dashboard-section">

                    <div className="section-heading">

                        <div>
                            <span className="panel-label">
                                VICTORIES
                            </span>

                            <h2>
                                Completed Quests
                            </h2>
                        </div>

                        <span className="panel-label">
                            {completedQuests.length} completed
                        </span>

                    </div>

                    <div className="quest-grid">

                        {completedQuests.map((quest) => (
                            <QuestCard
                                key={quest.id}
                                quest={quest}
                                onComplete={
                                    handleCompleteQuest
                                }
                            />
                        ))}

                    </div>

                </section>
            )}

        </div>
    );
}

export default Quests;
import {
    Check,
    Circle,
    Clock3,
    Star,
} from "lucide-react";

function QuestCard({ quest }) {
    return (
        <article
            className={`quest-card ${
                quest.completed ? "quest-completed" : ""
            }`}
        >

            <div className="quest-card-top">

                <div className="quest-category">
                    {quest.category}
                </div>

                <div className="quest-xp">
                    <Star size={14} />
                    +{quest.xp} XP
                </div>

            </div>

            <h3>{quest.title}</h3>

            <p>{quest.description}</p>

            <div className="quest-card-bottom">

                <div className="quest-difficulty">
                    <Clock3 size={14} />
                    {quest.difficulty}
                </div>

                <button
                    className={`quest-complete-button ${
                        quest.completed
                            ? "completed"
                            : ""
                    }`}
                >
                    {quest.completed ? (
                        <>
                            <Check size={15} />
                            Done
                        </>
                    ) : (
                        <>
                            <Circle size={15} />
                            Complete
                        </>
                    )}
                </button>

            </div>

        </article>
    );
}

export default QuestCard;
import { Shield, Sparkles } from "lucide-react";

function CharacterCard({ character, displayName }) {
    const level = character?.level || 1;
    const strength = character?.strength || 1;
    const intellect = character?.intellect || 1;
    const vitality = character?.vitality || 1;
    const discipline = character?.discipline || 1;

    let characterTitle = "Novice";

    if (level >= 10) {
        characterTitle = "Legend";
    } else if (level >= 5) {
        characterTitle = "Warrior";
    } else if (level >= 3) {
        characterTitle = "Adventurer";
    }

    return (
        <div className="character-card">
            <div className="character-background" />

            <div className="character-content">
                <div className="character-avatar">
                    <Shield size={42} />
                </div>

                <div className="character-info">
                    <span>CHARACTER</span>

                    <h2>{displayName || "Adventurer"}</h2>

                    <p>
                        Level {level} • {characterTitle}
                    </p>
                </div>

                <div className="character-badge">
                    <Sparkles size={15} />
                    New
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
    );
}

export default CharacterCard;
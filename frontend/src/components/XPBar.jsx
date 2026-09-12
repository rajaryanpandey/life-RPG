function XPBar({ currentXP = 0, requiredXP = 1000 }) {
    const percentage = Math.min(
        (currentXP / requiredXP) * 100,
        100
    );

    return (
        <div className="xp-bar-container">

            <div className="xp-bar">

                <div
                    className="xp-bar-fill"
                    style={{
                        width: `${percentage}%`,
                    }}
                />

            </div>

            <span className="xp-percentage">
                {Math.round(percentage)}%
            </span>

        </div>
    );
}

export default XPBar;
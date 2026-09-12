import { useEffect, useState } from "react";

import {
    Gift,
    Coins,
    Check,
    Sparkles,
    Loader2,
} from "lucide-react";

import {
    getRewards,
    getCharacter,
    getInventory,
    purchaseReward,
} from "../services/api";

function Rewards() {
    const [rewards, setRewards] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [gold, setGold] = useState(0);

    const [loading, setLoading] = useState(true);
    const [purchasingId, setPurchasingId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadRewards();
    }, []);

    const loadRewards = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                rewardsResponse,
                characterResponse,
                inventoryResponse,
            ] = await Promise.all([
                getRewards(),
                getCharacter(),
                getInventory(),
            ]);

            setRewards(
                Array.isArray(rewardsResponse.data)
                    ? rewardsResponse.data
                    : []
            );

            setGold(
                characterResponse.data?.gold || 0
            );

            setInventory(
                Array.isArray(inventoryResponse.data)
                    ? inventoryResponse.data
                    : []
            );
        } catch (err) {
            console.error(
                "Failed to load rewards:",
                err
            );

            setError(
                "Unable to load the reward shop. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };
    const handlePurchase = async (rewardId) => {
        try {
            setPurchasingId(rewardId);
            setError("");
            setSuccess("");

            const response = await purchaseReward(
                rewardId
            );

            setGold(
                response.data?.remaining_gold ?? gold
            );

            setSuccess(
                "Reward purchased successfully!"
            );

            await loadRewards();
        } catch (err) {
            console.error(
                "Failed to purchase reward:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Unable to purchase this reward."
            );
        } finally {
            setPurchasingId(null);
        }
    };

    const getInventoryQuantity = (rewardId) => {
        const item = inventory.find(
            (inventoryItem) =>
                inventoryItem.reward?.id === rewardId
        );

        return item?.quantity || 0;
    };
    return (
        <div className="page-container">

            <div className="page-header">

                <div>
                    <p className="page-eyebrow">
                        REWARD SHOP
                    </p>

                    <h1>
                        Rewards
                    </h1>

                    <p>
                        Spend your hard-earned coins on rewards.
                    </p>
                </div>

                <div className="reward-balance">

                    <Coins size={20} />

                    <div>
                        <span>
                            Your Balance
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

            {success && (
                <div className="auth-success">
                    {success}
                </div>
            )}

            <section className="reward-info-card">

                <div className="reward-info-icon">
                    <Sparkles size={24} />
                </div>

                <div>
                    <h3>
                        Keep completing quests!
                    </h3>

                    <p>
                        Complete quests to earn XP and coins.
                        Use your coins here to unlock rewards.
                    </p>
                </div>

            </section>
                    <section className="character-section">

                <div className="section-title">

                    <h2>
                        Available Rewards
                    </h2>

                    <p>
                        Choose a reward you have earned.
                    </p>

                </div>


                {loading ? (

                    <div className="quest-loading">
                        <Loader2 size={22} />
                        Loading rewards...
                    </div>

                ) : rewards.length === 0 ? (

                    <div className="quest-empty">

                        <Gift size={28} />

                        <h3>
                            No rewards available
                        </h3>

                        <p>
                            Check back later for new rewards.
                        </p>

                    </div>

                ) : (

                    <div className="rewards-grid">

                        {rewards.map((reward) => {
                            const quantity =
                                getInventoryQuantity(
                                    reward.id
                                );

                            const canAfford =
                                gold >= reward.price;

                            const purchasing =
                                purchasingId === reward.id;

                            return (
                                <article
                                    key={reward.id}
                                    className="reward-card"
                                >

                                    <div className="reward-card-icon">
                                        <Gift size={28} />
                                    </div>


                                    <div className="reward-card-content">

                                        <h3>
                                            {reward.name}
                                        </h3>

                                        <p>
                                            {reward.description}
                                        </p>

                                        {quantity > 0 && (
                                            <span>
                                                Owned: {quantity}
                                            </span>
                                        )}

                                    </div>


                                    <div className="reward-cost">

                                        <Coins size={16} />

                                        <span>
                                            {reward.price}
                                        </span>

                                    </div>

                                        <button
                                        type="button"
                                        className="reward-redeem-button"
                                        disabled={
                                            purchasing ||
                                            !canAfford
                                        }
                                        onClick={() =>
                                            handlePurchase(
                                                reward.id
                                            )
                                        }
                                    >

                                        {purchasing ? (

                                            <>
                                                <Loader2
                                                    size={16}
                                                    className="spin"
                                                />

                                                Purchasing...
                                            </>

                                        ) : canAfford ? (

                                            <>
                                                <Gift size={16} />

                                                Buy Reward
                                            </>

                                        ) : (

                                            <>
                                                <Coins size={16} />

                                                Not Enough Coins
                                            </>

                                        )}

                                    </button>

                                </article>
                            );
                        })}

                    </div>

                )}

            </section>
                <section className="reward-rules">

                <div className="section-title">

                    <h2>
                        How Rewards Work
                    </h2>

                </div>


                <div className="reward-rules-grid">

                    <div>
                        <span>01</span>

                        <h3>
                            Complete Quests
                        </h3>

                        <p>
                            Finish your daily and long-term quests.
                        </p>
                    </div>


                    <div>
                        <span>02</span>

                        <h3>
                            Earn Coins
                        </h3>

                        <p>
                            Successful quests give you coins.
                        </p>
                    </div>


                    <div>
                        <span>03</span>

                        <h3>
                            Redeem
                        </h3>

                        <p>
                            Spend your coins on available rewards.
                        </p>
                    </div>

                </div>

            </section>

        </div>
    );
}

export default Rewards;
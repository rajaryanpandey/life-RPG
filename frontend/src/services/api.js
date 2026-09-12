import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add access token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Automatically refresh expired access token
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refresh_token");

            if (!refreshToken) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");

                window.location.href = "/login";

                return Promise.reject(error);
            }

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/token/refresh/`,
                    {
                        refresh: refreshToken,
                    }
                );

                const newAccessToken = response.data.access;

                localStorage.setItem(
                    "access_token",
                    newAccessToken
                );

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");

                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// =========================
// QUEST API
// =========================

export const getQuests = () => {
    return api.get("/quests/");
};

export const getQuest = (id) => {
    return api.get(`/quests/${id}/`);
};

export const createQuest = (questData) => {
    return api.post("/quests/", questData);
};

export const updateQuest = (id, questData) => {
    return api.patch(`/quests/${id}/`, questData);
};

export const deleteQuest = (id) => {
    return api.delete(`/quests/${id}/`);
};

export const completeQuest = (id) => {
    return api.post(`/quests/${id}/complete/`);
};

export default api;

// =========================
// AUTH API
// =========================

export const loginUser = (credentials) => {
    return api.post("/token/", credentials);
};

export const registerUser = (userData) => {
    return api.post("/accounts/register/", userData);
};

export const getProfile = () => {
    return api.get("/accounts/profile/");
};

export const updateProfile = (profileData) =>
    api.put("/accounts/profile/", profileData);

// =========================
// GAME API
// =========================

export const getCharacter = () => {
    return api.get("/game/character/");
};

export const getDashboard = () => {
    return api.get("/game/dashboard/");
};

export const getRewards = () => {
    return api.get("/game/rewards/");
};

export const purchaseReward = (id) => {
    return api.post(`/game/rewards/${id}/purchase/`);
};

export const getInventory = () => {
    return api.get("/game/inventory/");
};

export const getAchievements = () => {
    return api.get("/game/achievements/");
};

export const getUnlockedAchievements = () => {
    return api.get("/game/achievements/unlocked/");
};

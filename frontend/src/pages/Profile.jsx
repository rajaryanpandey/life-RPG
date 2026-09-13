import { useEffect, useState } from "react";
import {
    User,
    Mail,
    Shield,
    LogOut,
    Save,
    Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    getProfile,
    updateProfile,
} from "../services/api";

function Profile() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Load profile from backend
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getProfile();

            setProfile({
                username: response.data.display_name || "",
                email: response.data.email || "",
                firstName: response.data.first_name || "",
                lastName: response.data.last_name || "",
            });
        } catch (err) {
            console.error("Failed to load profile:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to load your profile."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value,
        }));

        setMessage("");
        setError("");
    };
        const handleSave = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setMessage("");
            setError("");

            const response = await updateProfile({
                display_name: profile.username,
            });

            setProfile((previous) => ({
                ...previous,
                username: response.data.display_name || previous.username,
            }));

            setMessage("Profile changes saved successfully.");
        } catch (err) {
            console.error("Failed to update profile:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to save your profile changes."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        navigate("/");
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <p className="page-eyebrow">ACCOUNT</p>
                        <h1>Profile</h1>
                        <p>Loading your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">

            {/* Header */}
            <div className="page-header">
                <div>
                    <p className="page-eyebrow">ACCOUNT</p>

                    <h1>Profile</h1>

                    <p>
                        Manage your account information and preferences.
                    </p>
                </div>
            </div>

            {error && (
                <div className="auth-error">
                    {error}
                </div>
            )}

            <div className="profile-layout">

                {/* Profile Card */}
                <section className="profile-card">

                    <div className="profile-card-header">

                        <div className="profile-avatar">
                            <User size={32} />
                        </div>

                        <div>
                            <h2>{profile.username || "Adventurer"}</h2>
                            <p>Adventurer</p>
                        </div>

                    </div>

                    <div className="profile-divider" />

                    <div className="profile-account-info">

                        <div className="profile-info-item">
                            <Mail size={18} />

                            <div>
                                <span>Email</span>
                                <strong>
                                    {profile.email || "Not available"}
                                </strong>
                            </div>
                        </div>

                        <div className="profile-info-item">
                            <Shield size={18} />

                            <div>
                                <span>Account Status</span>
                                <strong>Active</strong>
                            </div>
                        </div>

                    </div>

                </section>

                {/* Edit Profile */}
                <section className="profile-edit-card">

                    <div className="section-title">
                        <h2>Personal Information</h2>

                        <p>
                            Update your basic profile information.
                        </p>
                    </div>

                    <form onSubmit={handleSave}>

                        <div className="profile-form-grid">

                            <div className="form-group">
                                <label htmlFor="firstName">
                                    First Name
                                </label>

                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={profile.firstName}
                                    onChange={handleChange}
                                    placeholder="Enter first name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName">
                                    Last Name
                                </label>

                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={profile.lastName}
                                    onChange={handleChange}
                                    placeholder="Enter last name"
                                />
                            </div>

                        </div>
                                <div className="form-group">

                            <label htmlFor="username">
                                Username
                            </label>

                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={profile.username}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={profile.email}
                                readOnly
                            />

                        </div>

                        {message && (
                            <div className="profile-success">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="profile-save-button"
                            disabled={saving}
                        >
                            <Save size={16} />

                            {saving ? "Saving..." : "Save Changes"}
                        </button>

                    </form>

                </section>

            </div>

            {/* Security */}
            <section className="profile-security">

                <div className="section-title">
                    <h2>Security</h2>

                    <p>
                        Manage your account security.
                    </p>
                </div>

                <div className="security-actions">

                    <button
                        className="security-button"
                        disabled
                    >
                        <Lock size={18} />

                        <div>
                            <strong>Change Password</strong>

                            <span>
                                the feature will be added later
                            </span>
                        </div>
                    </button>

                    <button
                        className="security-button danger"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />

                        <div>
                            <strong>Logout</strong>

                            <span>
                                Sign out of your Life RPG account.
                            </span>
                        </div>
                    </button>

                </div>

            </section>

        </div>
    );
}

export default Profile;
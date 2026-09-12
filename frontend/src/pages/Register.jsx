import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 8) {
            setError(
                "Password must contain at least 8 characters."
            );
            return;
        }

       setLoading(true);

try {
    await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
    });

    navigate("/login");
} catch (error) {
    console.error("Registration error:", error);

    const responseData = error.response?.data;

    if (responseData) {
        if (responseData.username) {
            setError(responseData.username[0]);
        } else if (responseData.email) {
            setError(responseData.email[0]);
        } else if (responseData.password) {
            setError(responseData.password[0]);
        } else if (responseData.detail) {
            setError(responseData.detail);
        } else {
            setError("Registration failed. Please check your details.");
        }
    } else {
        setError("Unable to connect to the server.");
    }
} finally {
    setLoading(false);
}
    };

    return (
        <main className="auth-page">
            <div className="auth-card">

                <div className="auth-header">
                    <div className="auth-logo">
                        ⚔
                    </div>

                    <h1>Create Your Character</h1>

                    <p>
                        Start your real-life RPG journey.
                    </p>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="username">
                            Username
                        </label>

                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Choose a username"
                            value={formData.username}
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
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                   <button
    type="submit"
    className="auth-button"
    disabled={loading}
>
    {loading ? "Creating..." : "Create Character"}
</button>

                </form>

                <div className="auth-footer">
                    <span>Already have an account?</span>

                    <Link to="/login">
                        Login
                    </Link>
                </div>

            </div>
        </main>
    );
}

export default Register;
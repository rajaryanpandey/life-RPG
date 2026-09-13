import { Bell, ChevronDown, LogOut, Menu, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar({ onMenuClick }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        navigate("/");
    };

    return (
        <header className="navbar">

            <div className="navbar-left">
                <button
                    className="mobile-menu-button"
                    onClick={onMenuClick}
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>

                <div
                    className="navbar-brand"
                    onClick={() => navigate("/dashboard")}
                >
                    <div className="brand-icon">
                        ⚔
                    </div>

                    <div>
                        <h2>Life RPG</h2>
                        <span>Level up your life</span>
                    </div>
                </div>
            </div>

            <div className="navbar-actions">

                <button
                    className="navbar-icon-button"
                    aria-label="Notifications"
                >
                    <Bell size={19} />
                    <span className="notification-dot" />
                </button>

                <div className="navbar-profile">

                    <div className="navbar-avatar">
                        <Shield size={18} />
                    </div>

                    <div className="navbar-user">
                        <strong>Player</strong>
                        <span>Adventurer</span>
                    </div>

                    <ChevronDown size={16} />

                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>

            </div>

        </header>
    );
}

export default Navbar;
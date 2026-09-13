import {
    BarChart3,
    CircleUserRound,
    LayoutDashboard,
    LogOut,
    Shield,
    Sparkles,
    Swords,
    Trophy,
    X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        navigate("/");
    };

    const navigationItems = [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Quests",
            path: "/quests",
            icon: Swords,
        },
        {
            label: "Character",
            path: "/character",
            icon: Shield,
        },
        {
            label: "Rewards",
            path: "/rewards",
            icon: Trophy,
        },
        {
            label: "Profile",
            path: "/profile",
            icon: CircleUserRound,
        },
    ];

    return (
        <>
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                />
            )}

            <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>

                <div className="sidebar-header">

                    <div className="sidebar-title">
                        <Sparkles size={18} />
                        <span>Adventure</span>
                    </div>

                    <button
                        className="sidebar-close"
                        onClick={onClose}
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>

                </div>

                <nav className="sidebar-nav">

                    <div className="sidebar-section-label">
                        MAIN
                    </div>

                    {navigationItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `sidebar-link ${
                                        isActive
                                            ? "sidebar-link-active"
                                            : ""
                                    }`
                                }
                            >
                                <Icon size={19} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}

                    <div className="sidebar-section-label">
                        PROGRESS
                    </div>

                    <NavLink
                        to="/character"
                        onClick={onClose}
                        className="sidebar-link"
                    >
                        <BarChart3 size={19} />
                        <span>Stats</span>
                    </NavLink>

                </nav>

                <div className="sidebar-bottom">

                    <div className="sidebar-player-card">

                        <div className="sidebar-player-avatar">
                            <Shield size={20} />
                        </div>

                        <div>
                            <strong>Level 1</strong>
                            <span>Novice Adventurer</span>
                        </div>

                    </div>

                    <button
                        className="sidebar-logout"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>

                </div>

            </aside>
        </>
    );
}

export default Sidebar;
import { Routes, Route } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Quests from "./pages/Quests";
import Character from "./pages/Character";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";

function ProtectedLayout({ children }) {
    return (
        <ProtectedRoute>
            <AppLayout>
                {children}
            </AppLayout>
        </ProtectedRoute>
    );
}

function App() {
    return (
        <Routes>

            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedLayout>
                        <Dashboard />
                    </ProtectedLayout>
                }
            />

            <Route
                path="/quests"
                element={
                    <ProtectedLayout>
                        <Quests />
                    </ProtectedLayout>
                }
            />

            <Route
                path="/character"
                element={
                    <ProtectedLayout>
                        <Character />
                    </ProtectedLayout>
                }
            />

            <Route
                path="/rewards"
                element={
                    <ProtectedLayout>
                        <Rewards />
                    </ProtectedLayout>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedLayout>
                        <Profile />
                    </ProtectedLayout>
                }
            />

        </Routes>
    );
}

export default App;
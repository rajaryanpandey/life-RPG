import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
    const location = useLocation();

    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        return (
            <Navigate
                to="/"
                state={{ from: location }}
                replace
            />
        );
    }

    return children;
}

export default ProtectedRoute;
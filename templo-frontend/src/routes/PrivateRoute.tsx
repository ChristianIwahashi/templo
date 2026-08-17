import { Navigate, Outlet } from "react-router-dom";
import { UseAuth } from "../hooks/UseAuth";

export function PrivateRoute() {
    const { isAuthenticated } = UseAuth();

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
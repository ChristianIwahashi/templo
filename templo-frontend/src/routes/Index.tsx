import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";
import { Login } from "../pages/public/Login";
import { PrivateRoute } from "./PrivateRoute";
import { Dashboard } from "../pages/private/Dashboard";
import { PrivateLayout } from "../components/PrivateLayout";

export function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <BrowserRouter>
            <Routes>
                <Route 
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
                />

                <Route element={<PrivateRoute />}>
                    <Route element={<PrivateLayout/>}>
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}
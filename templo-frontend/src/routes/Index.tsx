import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";
import { Login } from "../pages/public/Login";
import { PrivateRoute } from "./PrivateRoute";
import { Dashboard } from "../pages/private/Dashboard";

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
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/turmas" element={<h1>Página de Turmas (Privada)</h1>} />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}
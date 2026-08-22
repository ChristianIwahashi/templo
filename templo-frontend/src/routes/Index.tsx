import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UseAuth } from "../hooks/UseAuth";
import { Login } from "../pages/public/Login";
import { PrivateRoute } from "./PrivateRoute";
import { Dashboard } from "../pages/private/Dashboard";
import { PrivateLayout } from "../components/PrivateLayout";
import { Historico } from '../pages/private/Historico';
import { Mensalidade } from "../pages/private/Mensalidade";
import { Avisos } from "../pages/private/Avisos";
import { Materiais } from "../pages/private/Materiais";
import { Perfil } from "../pages/private/Perfil";
import { GerenciarChamada } from "../pages/private/GerenciarChamada";

export function AppRoutes() {
    const { isAuthenticated, loading, user } = UseAuth();

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 font-semibold animate-pulse">Carregando...</p>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
                />

                <Route element={<PrivateRoute />}>
                    <Route element={<PrivateLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />

                        {user?.papel === 'ALUNO' && (
                            <>
                                <Route path="/historico" element={<Historico />} />
                                <Route path="/mensalidade" element={<Mensalidade />} />
                                <Route path="/avisos" element={<Avisos />} />
                                <Route path="/materiais" element={<Materiais />} />
                                <Route path="/perfil" element={<Perfil />} />
                            </>
                        )}

                        {user?.papel === 'PROFESSOR' && (
                            <>
                                <Route path="/gerenciar-chamada" element={<GerenciarChamada />} />
                            </>
                        )}
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}
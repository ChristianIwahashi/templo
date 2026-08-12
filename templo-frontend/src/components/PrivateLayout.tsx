import { DollarSign, FileText, FolderOpen, GraduationCap, Home, Megaphone, Menu, PieChart, Shield, Star, User, UserCheck, Users, X } from "lucide-react";
import { useAuth } from "../hooks/UseAuth";
import logoTemplo from '.../assets/images/Hongwanji.png';
import { useLocation } from "react-router-dom";
import { useState } from "react";

const menuConfig = {
    ALUNO: [
        { path: '/dashboard', label: 'Início', icon: Home },
        { path: '/avisos', label: 'Avisos', icon: Megaphone },
        { path: '/materiais', label: 'Material Didático', icon: FileText },
        { path: '/historico', label: 'Histórico Acadêmico', icon: GraduationCap },
        { path: '/mensalidade', label: 'Mensalidade', icon: DollarSign },
        { path: '/perfil', label: 'Meu Perfil', icon: User }
    ],
    PROFESSOR: [
        { path: '/dashboard', label: 'Início', icon: Home },
        { path: '/gerenciar-avisos', label: 'Gerenciar Avisos', icon: Megaphone },
        { path: '/gerenciar-materiais', label: 'Gerenciar Materiais', icon: FolderOpen },
        { path: '/gerenciar-chamada', label: 'Gerenciar Chamada', icon: Users },
        { path: '/gerenciar-notas', label: 'Gerenciar Notas', icon: Star },
        { path: '/relatorios', label: 'Relatórios', icon: PieChart }
    ],
    Gestor: [
        { path: '/dashboard', label: 'Início', icon: Home },
        { path: '/gerenciar-alunos', label: 'Gerenciar Alunos', icon: Users },
        { path: '/gerenciar-professores', label: 'Gerenciar Professores', icon: UserCheck },
        { path: '/gerenciar-gestores', label: 'Gerenciar Administradores', icon: Shield },
        { path: '/gerenciar-avisos', label: 'Gerenciar Avisos', icon: Megaphone },
        { path: '/gerenciar-materiais', label: 'Gerenciar Materiais', icon: FolderOpen },
        { path: '/gerenciar-mensalidade', label: 'Gerenciar Mensalidade', icon: DollarSign },
        { path: '/relatorios', label: 'Relatórios', icon: PieChart }
    ],
};

export function PrivateLayout() {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const papel = user?.papel || 'ALUNO';
    const menuItens = menuConfig[papel];

    const inicialNome = user?.nome ? user.nome.charAt(0).toUpperCase() : 'U';

    return (
        <div className="h-screen overflow-hidden flex flex-col md:flex-row w-full bg-gray-50 font-sans">

            <div className="md:hidden bg-sys-blue text-white p-4 flex justify-between items-center shadow-md z-20">
                <div className="flex items-center gap-2 font-bold text-lg">
                    <img src={logoTemplo} alt="Logo" className="w-8 h-8 object-contain invert" />
                    <span>Assoka</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1 hover:bg-white/20 rounded cursor-pointer">
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-20 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)} />
            )}

            <aside className={`bg-white w-64 border-r border-gray-200 flex flex-col h-full absolute md:relative z-30 transition-transform duration-300
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}>

                <div className="p-6 border-b border-gray-100 hidden md:flex items-center gap-3">
                    <img src={logoTemplo} alt="Logo do Templo" className="w-10 h-10 object-contain" />
                </div>

            </aside>

        </div>
    )
};
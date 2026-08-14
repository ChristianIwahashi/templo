import { Bell, ChevronLeft, ChevronRight, DollarSign, FileText, FolderOpen, Globe, GraduationCap, Home, LogOut, Megaphone, Menu, PieChart, Shield, Star, User, UserCheck, Users, X } from "lucide-react";
import { useAuth } from "../hooks/UseAuth";
import LogoTemplo from "../assets/images/Hongwanji.png";
import { Link, Outlet, useLocation } from "react-router-dom";
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
    GESTOR: [
        { path: '/dashboard', label: 'Início', icon: Home },
        { path: '/gerenciar-alunos', label: 'Gerenciar Alunos', icon: Users },
        { path: '/gerenciar-professores', label: 'Gerenciar Professores', icon: UserCheck },
        { path: '/gerenciar-gestores', label: 'Gerenciar Gestores', icon: Shield },
        { path: '/gerenciar-avisos', label: 'Gerenciar Avisos', icon: Megaphone },
        { path: '/gerenciar-informatico', label: 'Gerenciar Website', icon: Globe },
        { path: '/gerenciar-materiais', label: 'Gerenciar Materiais', icon: FolderOpen },
        { path: '/gerenciar-mensalidade', label: 'Gerenciar Mensalidade', icon: DollarSign },
        { path: '/relatorios', label: 'Relatórios', icon: PieChart }
    ],
};

export function PrivateLayout() {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const papel = user?.papel || 'ALUNO';
    const menuItens = menuConfig[papel];

    const inicialNome = user?.nome ? user.nome.charAt(0).toUpperCase() : 'U';

    return (
        <div className="h-screen overflow-hidden flex flex-col md:flex-row w-full bg-gray-50 font-sans">

            {/*Mobile*/}
            <div className="md:hidden bg-sys-blue text-white p-4 flex justify-between items-center shadow-md z-20">
                <div className="flex items-center gap-2 font-bold text-lg">
                    <img src={LogoTemplo} alt="Logo" className="w-8 h-8 object-contain invert" />
                    <span>Assoka</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1 hover:bg-white/20 rounded cursor-pointer">
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/*Overlay Mobile*/}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/*Barra Lateral Esquerda*/}
            <aside className={`bg-white w-64 border-r border-gray-200 flex flex-col h-full absolute md:relative z-30 transition-all duration-300
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'} w-64
                `}>

                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="hidden md:flex items-center justify-center p-1.5 rounded-full bg-white border border-gray-200 shadow-md text-gray-500 hover:text-sys-blue-hover:scale-110 absolute -right-3.5 top-6 z-40 cursor-pointer transition-all"
                    title={isSidebarCollapsed ? "Expandir menu" : "Recolher menu"}>
                    {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                {/*Logo Templo*/}
                <div className={`bg-sys-blue h-18 hidden md:flex items-center gap-3 shrink-0 transition-all duration-300 overflow-hidden
                    ${isSidebarCollapsed ? 'px-3 justify-center' : 'px-6'}
                `}>
                    <img src={LogoTemplo} alt="Logo do Templo" className="w-10 h-10 object-contain shrink-0" />
                    <div className={`transition-opacity duration-200 whitespace-nowrap overflow-hidden
                        ${isSidebarCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
                        <h2 className="font-bold text-white">Assoka</h2>
                        <h2 className="text-xs text-blue-100">Nichiyougakkou</h2>
                    </div>
                </div>

                {/*Perfil*/}
                <div className="p-4 border-b border-gray-100 overflow-hidden">
                    <div className="flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-sys-blue flex items-center justify-center font-bold text-lg uppercase shrink-0">
                            {inicialNome}
                        </div>

                        {!isSidebarCollapsed && (
                            <div className="overflow-hidden">
                                <p className="font-semibold text-gray-800 text-sm truncate" title={user?.nome}>
                                    {user?.nome || 'Usuário'}
                                </p>
                                <p className="text-xs text-sys-blue capitalize font-medium">
                                    {user?.papel?.toLowerCase() || 'Papel'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/*Links Navegação*/}
                <nav className="grow overflow-y-auto py-4 space-y-1">
                    {menuItens.map((item) => {
                        const IconeComponente = item.icon;
                        const IsActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex item-center gap-3 px-6 py-3 transition font-medium text-sm border-r-4
                                    ${IsActive
                                        ? 'bg-blue-50/50 text-sys-blue border-sys-blue'
                                        : 'text-gray-600 border-transparent hover:bg-gray-50 hover:text-sys-blue'
                                    }
                                `}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <IconeComponente className="w-5 h-5 shrink-0" />
                                <span className={`whitespace-nowrap transition-opacity duration-200 overflow-hidden
                                    ${isSidebarCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/*Sair*/}
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={signOut}
                        title={isSidebarCollapsed ? "Sair do Sistema" : undefined}
                        className={`w-full flex items-center gap-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition font-medium cursor-pointer
                            ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'}`}>
                        <LogOut className="w-5 h-5" />
                        <span className={`whitespace-nowrap transition-opacity duration-200 overflow-hidden
                            ${isSidebarCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
                            Sair do Sistema
                        </span>
                    </button>
                </div>
            </aside>

            {/*Área central*/}
            <main className="grow flex flex-col h-full overflow-hidden">

                {/*Header*/}
                <header className="bg-white shadow-sm border-b border-gray-100 h-18 px-4 lg:px-6 flex justify-between items-center z-10 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Assoka Gakkou</h2>
                        <p className="text-xs text-gray-500 hidden sm:block">Bem-vindo(a) ao sistema do Honpa Hongwanji</p>
                    </div>

                    {/*Notificações*/}
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-400 hover:text-sys-blue transition rounded-full hover:bg-blue-50 cursor-pointer">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/*Conteúdo*/}
                <div className="grow overflow-y-auto bg-slate-50">
                    <Outlet />
                </div>
            </main>
        </div>
    )
};
import { Bell, ChevronLeft, ChevronRight, DollarSign, FileText, FolderOpen, Globe, GraduationCap, Home, LogOut, Megaphone, Menu, PieChart, Shield, Star, User, UserCheck, Users, X, Sun, Moon } from "lucide-react";
import { UseAuth } from "../hooks/UseAuth";
import { useTheme } from "../contexts/ThemeContext";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
const LogoTemplo = "/Hongwanji.png";

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
        { path: '/gerenciar-nota', label: 'Gerenciar Notas', icon: Star },
        { path: '/relatorio', label: 'Relatórios', icon: PieChart },
        { path: '/perfil', label: 'Meu Perfil', icon: User }
    ],
    GESTOR: [
        { path: '/dashboard', label: 'Início', icon: Home },
        { path: '/gerenciar-turmas', label: 'Gerenciar Turmas', icon: GraduationCap },
        { path: '/gerenciar-alunos', label: 'Gerenciar Alunos', icon: Users },
        { path: '/gerenciar-professores', label: 'Gerenciar Professores', icon: UserCheck },
        { path: '/gerenciar-gestores', label: 'Gerenciar Gestores', icon: Shield },
        { path: '/gerenciar-avisos', label: 'Gerenciar Avisos', icon: Megaphone },
        { path: '/gerenciar-informatico', label: 'Gerenciar Website', icon: Globe },
        { path: '/gerenciar-materiais', label: 'Gerenciar Materiais', icon: FolderOpen },
        { path: '/gerenciar-chamada', label: 'Gerenciar Chamada', icon: Users },
        { path: '/gerenciar-nota', label: 'Gerenciar Notas', icon: Star },
        { path: '/gerenciar-mensalidade', label: 'Gerenciar Mensalidade', icon: DollarSign },
        { path: '/relatorio', label: 'Relatórios', icon: PieChart },
        { path: '/perfil', label: 'Meu Perfil', icon: User }
    ],
};

export function PrivateLayout() {
    const { user, signOut } = UseAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const papel = user?.papel || 'ALUNO';
    const menuItens = menuConfig[papel];
    const inicialNome = user?.nome ? user.nome.charAt(0).toUpperCase() : 'U';

    return (
        <div className="h-screen overflow-hidden flex flex-col md:flex-row w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors">

            {/*Mobile Header*/}
            <div className="md:hidden bg-sys-blue text-white p-4 flex justify-between items-center shadow-md z-20">
                <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg cursor-pointer">
                    <img src={LogoTemplo} alt="Logo" className="w-8 h-8 object-contain invert" />
                    <span>Assoka</span>
                </Link>
                <div className="flex items-center gap-2">
                    <button onClick={toggleTheme} className="p-1 hover:bg-white/20 rounded cursor-pointer">
                        {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1 hover:bg-white/20 rounded cursor-pointer">
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/*Overlay Mobile*/}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/*Sidebar Desktop*/}
            <aside className={`bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col h-full absolute md:relative z-30 transition-all duration-300
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'} w-64
            `}>
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="hidden md:flex items-center justify-center p-1.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md text-gray-500 dark:text-gray-400 hover:text-sys-blue absolute -right-3.5 top-6 z-40 cursor-pointer transition-all"
                    title={isSidebarCollapsed ? "Expandir menu" : "Recolher menu"}
                >
                    {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                {/*Logo Templo*/}
                <Link
                    to="/dashboard"
                    title="Ir para o Dashboard"
                    className={`bg-sys-blue h-18 hidden md:flex items-center gap-3 shrink-0 transition-all duration-300 overflow-hidden cursor-pointer hover:opacity-95 ${isSidebarCollapsed ? 'px-3 justify-center' : 'px-6'
                        }`}
                >
                    <img src={LogoTemplo} alt="Logo do Templo" className="w-10 h-10 object-contain shrink-0" />
                    <div className={`transition-opacity duration-200 whitespace-nowrap overflow-hidden ${isSidebarCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
                        <h2 className="font-bold text-white">Assoka</h2>
                        <h2 className="text-xs text-blue-100">Nichiyougakkou</h2>
                    </div>
                </Link>

                {/*Perfil*/}
                <div className="p-4 border-b border-gray-100 dark:border-slate-800 overflow-hidden">
                    <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-slate-800 text-sys-blue flex items-center justify-center font-bold text-lg uppercase shrink-0">
                            {inicialNome}
                        </div>

                        {!isSidebarCollapsed && (
                            <div className="overflow-hidden">
                                <p className="font-semibold text-gray-800 dark:text-slate-100 text-sm truncate" title={user?.nome}>
                                    {user?.nome || 'Usuário'}
                                </p>
                                <p className="text-xs text-sys-blue capitalize font-medium">
                                    {user?.papel?.toLowerCase() || 'Papel'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/*Navegação*/}
                <nav className="grow overflow-y-auto py-4 space-y-1">
                    {menuItens.map((item) => {
                        const IconeComponente = item.icon;
                        const IsActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                title={isSidebarCollapsed ? item.label : undefined}
                                className={`flex items-center gap-3 py-3 transition font-medium text-sm border-r-4
                                    ${IsActive
                                        ? 'bg-blue-50/50 dark:bg-blue-900/20 text-sys-blue border-sys-blue'
                                        : 'text-gray-600 dark:text-slate-400 border-transparent hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-sys-blue'
                                    }
                                    ${isSidebarCollapsed ? 'justify-center px-0' : 'px-6'}
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
                <div className="p-4 border-t border-gray-100 dark:border-slate-800">
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        title={isSidebarCollapsed ? "Sair do Sistema" : undefined}
                        className={`w-full flex items-center gap-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition font-medium cursor-pointer
                            ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'}`}>
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span className={`whitespace-nowrap transition-opacity duration-200 overflow-hidden
                            ${isSidebarCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
                            Sair do Sistema
                        </span>
                    </button>
                </div>
            </aside>

            {/*Área Central*/}
            <main className="grow flex flex-col h-full overflow-hidden">
                <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-100 dark:border-slate-800 h-18 px-4 lg:px-6 flex justify-between items-center z-10 shrink-0 transition-colors">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">Assoka Gakkou</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Bem-vindo(a) ao sistema do Honpa Hongwanji</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Adicionado 'hidden md:flex' para ocultar no mobile */}
                        <button
                            onClick={toggleTheme}
                            className="hidden md:flex p-2 text-gray-500 dark:text-gray-400 hover:text-sys-blue dark:hover:text-blue-400 transition rounded-full hover:bg-blue-50 dark:hover:bg-slate-800 cursor-pointer"
                            title={theme === 'dark' ? "Mudar para modo claro" : "Mudar para modo escuro"}
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <button className="relative p-2 text-gray-400 hover:text-sys-blue transition rounded-full hover:bg-blue-50 dark:hover:bg-slate-800 cursor-pointer">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>
                    </div>
                </header>

                <div className="grow overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 transition-colors">
                    <Outlet />
                </div>
            </main>

            {/*Modal de Logout*/}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center border border-gray-100 dark:border-slate-800 animate-modal-enter">
                        <div className="w-12 h-12 bg-red-50 dark:bg-red-950/50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogOut className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-2">Encerrar Sessão</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                            Você tem certeza de que deseja sair do sistema?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsLogoutModalOpen(false)}
                                className="flex-1 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => { setIsLogoutModalOpen(false); signOut(); }}
                                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold cursor-pointer"
                            >
                                Confirmar Sair
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ExternalLink, Sun, Moon } from "lucide-react";
import LogoTemplo from "../../public/Hongwanji.png";
import { useTheme } from "../contexts/ThemeContext";

export function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { path: "/", label: "Sobre o Templo" },
    { path: "/eventos", label: "Eventos" },
    { path: "/galeria", label: "Galeria" },
    { path: "/aulas-japones", label: "Aulas de Japonês" },
  ];

  return (
    <nav className="bg-templo-blue dark:bg-slate-900 text-white sticky top-0 z-40 shadow-lg transition-colors border-b border-blue-600/20 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">

          {/*Logo e Nome do Templo*/}
          <Link to="/" className="flex items-center gap-3 cursor-pointer group shrink-0">
            <img 
              src={LogoTemplo} 
              alt="Logo do Templo" 
              className="h-14 w-14 sm:h-16 sm:w-16 object-contain brightness-0 invert transition-transform group-hover:scale-105"
            />
            <div>
              <h1 className="font-bold text-base lg:text-lg xl:text-xl tracking-wide leading-tight max-w-70 sm:max-w-sm">
                Templo Honpa Hongwanji de Lins
              </h1>
              <p className="text-[11px] text-blue-100 dark:text-blue-300 opacity-90 hidden sm:block">
                Comunidade Budista Sul-Americana Jodo Shinshu
              </p>
            </div>
          </Link>

          {/*Menu Desktop*/}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 shrink-0">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs lg:text-sm font-medium transition-all hover:opacity-80 py-1 text-center whitespace-nowrap
                    ${isActive ? 'border-b-2 border-white font-bold' : 'opacity-90'}
                  `}
                >
                  {link.label}
                </Link>
              );
            })}

            {/*Botão de Tema*/}
            <button
              onClick={toggleTheme}
              className="p-2 text-white/90 hover:text-white transition rounded-full hover:bg-black/10 cursor-pointer shrink-0"
              title={theme === 'dark' ? "Mudar para modo claro" : "Mudar para modo escuro"}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/*Botão do Portal Acadêmico*/}
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs lg:text-sm transition-all hover:scale-105 bg-white text-templo-blue dark:bg-slate-800 dark:text-blue-400 shadow-md hover:shadow-lg cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Portal Acadêmico</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/*Botões Mobile*/}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-white transition rounded-full hover:bg-black/10 cursor-pointer"
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white focus:outline-none cursor-pointer"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/*MENU MOBILE*/}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-templo-blue dark:bg-slate-900 border-t border-blue-600/30 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2 px-3 rounded-md text-sm font-medium transition-colors ${isActive
                  ? 'bg-black/20 font-bold border-l-4 border-white'
                  : 'hover:bg-white/10 opacity-90'
                  }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-2">
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm bg-white text-templo-blue dark:bg-slate-800 dark:text-blue-400 shadow-md"
            >
              <span>Portal Acadêmico</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
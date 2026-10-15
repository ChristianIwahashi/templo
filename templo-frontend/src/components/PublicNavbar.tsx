import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ExternalLink } from "lucide-react";
import LogoTemplo from "../assets/images/Hongwanji.png";

export function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navLinks = [
    { path: "/", label: "Sobre o Templo" },
    { path: "/eventos", label: "Eventos" },
    { path: "/galeria", label: "Galeria" },
    { path: "/aulas-japones", label: "Aulas de Japonês" },
  ];

  return (
    <nav className="bg-[#0060ba] text-white sticky top-0 z-40 shadow-lg transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/*Logo/Nome do Templo*/}
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <img 
              src={LogoTemplo} 
              alt="Logo do Templo" 
              className="h-16 w-16 object-contain invert transition-transform group-hover:scale-105"
            />
            <div>
              <h1 className="font-bold text-lg sm:text-xl md:text-2xl tracking-wide leading-tight">
                Templo Honpa Hongwanji de Lins
              </h1>
              <p className="text-[11px] text-blue-100 opacity-90 hidden sm:block">Comunidade Budista Sul-Americana Jodo Shinshu</p>
            </div>
          </Link>
          
          {/*Menu Desktop*/}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm lg:text-base font-medium transition-all hover:opacity-80 py-1
                    ${isActive ? 'border-b-2 border-white font-bold' : 'opacity-90'}
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
            
            {/*Botão para o Portal*/}
            <Link
              to="/login"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 bg-white text-[#0060ba] shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>Portal Acadêmico</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/*Botão Navegação Mobile*/}
          <div className="md:hidden flex items-center">
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

      {/*Menu Aberto Mobile*/}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 space-y-2 bg-[#004e96] border-t border-blue-400/20 animate-fade-in-up">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-left px-3 py-2.5 text-base font-medium hover:bg-black/10 rounded-lg text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full text-center mt-4 px-4 py-3 rounded-xl font-bold bg-white text-[#0060ba] shadow-md"
          >
            Acessar Portal Acadêmico
          </Link>
        </div>
      )}
    </nav>
  );
}
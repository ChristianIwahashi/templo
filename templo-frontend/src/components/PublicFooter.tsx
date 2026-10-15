import { Phone, Mail, MapPin } from "lucide-react";

export function PublicFooter() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-200 pt-16 pb-8 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/*Coluna Sobre*/}
          <div className="space-y-4">
            <h4 className="text-2xl font-bold text-white mb-6">Templo Honpa Hongwanji de Lins</h4>
            <p className="opacity-80 leading-relaxed text-sm text-slate-300">
              Um espaço dedicado aos ensinamentos budistas, à preservação da cultura japonesa e da língua japonesa.
            </p>
          </div>

          {/*Coluna Contatos*/}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white mb-6">Contatos</h4>
            <ul className="space-y-3 opacity-90 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sys-blue shrink-0" />
                <span>(14) 3533-0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sys-blue shrink-0" />
                <span>ksklins@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 mt-4">
                <MapPin className="w-4 h-4 text-sys-blue shrink-0 mt-1" />
                <span>Rua 9 de Julho, 1455<br />Centro<br />Lins - SP, 16400-111</span>
              </li>
            </ul>
          </div>

          {/*Coluna Redes Sociais*/}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white mb-6">Redes Sociais</h4>
            <div className="flex gap-4">
              
              {/*Botão Facebook*/}
              <a 
                href="https://www.facebook.com/linshongwanji#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-slate-800 text-white hover:bg-white hover:text-black transition-colors cursor-pointer flex items-center justify-center"
                title="Siga-nos no Facebook"
                aria-label="Facebook do Templo"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/*Botão Instagram*/}
              <a 
                href="https://www.instagram.com/seinenkai_lins/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-slate-800 text-white hover:bg-white hover:text-black transition-colors cursor-pointer flex items-center justify-center"
                title="Siga-nos no Instagram"
                aria-label="Instagram do Templo"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

            </div>
            <p className="opacity-80 mt-6 text-sm text-slate-400">
              Siga-nos nas redes sociais.
            </p>
          </div>
        </div>

        {/*Direitos Autorais*/}
        <div className="border-t border-white/20 pt-8 text-center text-sm opacity-60 text-slate-400">
          <p>&copy; {anoAtual} Templo Honpa Hongwanji de Lins. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
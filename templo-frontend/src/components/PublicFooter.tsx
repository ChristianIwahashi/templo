import { Phone, Mail, MapPin } from "lucide-react";

export function PublicFooter() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-200 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/*Coluna Sobre*/}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white mb-4">Templo Honpa Hongwanji de Lins</h4>
            <p className="text-sm opacity-80 leading-relaxed text-slate-300">
              Um espaço dedicado aos ensinamentos budistas, à preservação da cultura nipo-brasileira e ao ensino da língua japonesa através da Escola de Língua Japonesa de Lins (Assoka).
            </p>
          </div>

          {/*Coluna Contatos*/}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white mb-4">Secretaria e Contato</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sys-blue shrink-0" />
                <span>(14) 3522-3184</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sys-blue shrink-0" />
                <span>ksklins@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 mt-2">
                <MapPin className="w-4 h-4 text-sys-blue shrink-0 mt-1" />
                <span>Rua 9 de Julho, 1455 - Centro<br />Lins - SP, CEP: 16400-111</span>
              </li>
            </ul>
          </div>

          {/*Coluna Institucional*/}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white mb-4">Atividades Comunitárias</h4>
            <p className="text-sm opacity-80 leading-relaxed text-slate-300">
              Cultos Dominicais, Escola Dominical Asoka, Grupo de Jovens Koorin Seinenkai e festivais culturais abertos a toda a sociedade.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-slate-800 text-sys-blue text-xs font-semibold rounded-full border border-slate-700">
                Namo Amidabutsu
              </span>
            </div>
          </div>

        </div>

        {/*Direitos Autorais */}
        <div className="border-t border-slate-800 pt-8 text-center text-xs opacity-60 text-slate-400">
          <p>&copy; {anoAtual} Templo Honpa Hongwanji de Lins. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
import { Info } from 'lucide-react';

export interface AutorAuditoria {
  idUsuario: number;
  nome: string;
  papel: string;
}
interface InfoAuditoriaProps {
  criadoPor?: AutorAuditoria | null;
  atualizadoPor?: AutorAuditoria | null;
  posicao?: 'esquerda' | 'direita';
}

export function InfoAuditoria({ 
  criadoPor, 
  atualizadoPor, 
  posicao = 'direita'
}: InfoAuditoriaProps) {
  const isDireita = posicao === 'direita';

  return (
    <div 
      className="relative inline-flex items-center text-gray-400 hover:text-sys-blue cursor-help group transition-colors" 
      onClick={e => e.stopPropagation()}
    >
      <Info className="w-4 h-4 shrink-0" />

      <div className={`absolute top-1/2 -translate-y-1/2 hidden w-56 rounded-xl bg-white p-3 text-xs text-gray-700 shadow-2xl group-hover:block z-50 border border-gray-200 pointer-events-none text-left
        ${isDireita ? 'left-full ml-2.5' : 'right-full mr-2.5'}
      `}>
        <div className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-gray-200
          ${isDireita 
            ? '-left-1.5 border-b border-l' 
            : '-right-1.5 border-t border-r'
          }
        `}></div>

        <div className="mb-1.5">
          <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider">Criado por:</span>
          <p className="font-semibold text-gray-800 text-xs leading-tight mt-0.5">
            {criadoPor ? `${criadoPor.nome} ` : 'Registro do sistema'}
            {criadoPor && <span className="text-sys-blue text-[10px]">({criadoPor.papel})</span>}
          </p>
        </div>

        <div className="pt-1.5 border-t border-gray-100">
          <span className="text-amber-600 block text-[9px] uppercase font-bold tracking-wider">Última alteração:</span>
          <p className="font-semibold text-gray-800 text-xs leading-tight mt-0.5">
            {atualizadoPor ? `${atualizadoPor.nome} ` : <span className="text-gray-400 font-normal italic text-[11px]">Nenhuma</span>}
            {atualizadoPor && <span className="text-amber-600 text-[10px]">({atualizadoPor.papel})</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
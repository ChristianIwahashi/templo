import { useEffect, useState } from "react";
import { Api } from "../../api/api";
import { Clock, User, Info, BookOpen, ZoomIn, X } from "lucide-react";

interface AvisoAula {
  idAvisoAula: number;
  titulo: string;
  dataPostagem: string;
  imagemUrl?: string;
  professor: { usuario: { nome: string } };
}

export function Avisos() {
  const [avisos, setAvisos] = useState<AvisoAula[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [imagemZoom, setImagemZoom] = useState<string | null>(null);

  useEffect(() => {
    async function carregarAvisosDaTurma() {
      try {
        setLoading(true);
        const response = await Api.get('/aviso-aula');
        setAvisos(response.data);
      } catch (error) {
        console.error(error);
        setErro('Não foi possível carregar o mural de avisos da sua turma.');
      } finally {
        setLoading(false);
      }
    }
    carregarAvisosDaTurma();
  }, []);

  function formatarData(dataStr: string) {
    return new Date(dataStr).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-slate-400 font-medium animate-pulse">Buscando recados do professor...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 p-4 rounded-xl border border-red-200 dark:border-red-900 font-semibold text-center">
          {erro}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 animate-fade-in-up relative text-slate-800 dark:text-slate-100">
      
      {/*Título da Seção*/}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 pb-4">
        <BookOpen className="w-6 h-6 text-sys-blue" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Recados da Turma</h2>
      </div>

      {/*Lista de Avisos*/}
      <div className="space-y-4">
        {avisos.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-800 text-center text-gray-500 dark:text-slate-400">
            <Info className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="font-semibold">Nenhum aviso ou recado para a sua turma no momento.</p>
          </div>
        ) : (
          avisos.map((aviso) => (
            <div key={aviso.idAvisoAula} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-md transition overflow-hidden">
              <div className="p-6 space-y-4">
                
                <div className="flex flex-wrap justify-between items-start gap-2 border-b border-gray-100 dark:border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-slate-100 text-lg leading-tight">{aviso.titulo}</h4>
                    <p className="text-xs text-sys-blue font-semibold flex items-center gap-1 mt-1.5">
                      <User className="w-3.5 h-3.5" /> Prof: {aviso.professor.usuario.nome}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {formatarData(aviso.dataPostagem)}
                  </span>
                </div>
                
                {aviso.imagemUrl && (
                  <div
                    onClick={() => setImagemZoom(aviso.imagemUrl || null)}
                    className="relative rounded-xl overflow-hidden h-64 sm:h-80 bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 flex items-center justify-center cursor-pointer group"
                    title="Clique para ver em tamanho cheio"
                  >
                    <img
                      src={aviso.imagemUrl}
                      alt="Anexo do aviso"
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    />

                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                      <span className="bg-black/50 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs">
                        <ZoomIn className="w-4 h-4" /> Clique para ampliar
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/*Modal Lightbox*/}
      {imagemZoom && (
        <div 
          onClick={() => setImagemZoom(null)} 
          className="fixed inset-0 bg-black/85 z-300 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out animate-fade-in-up"
        >
          <button 
            onClick={() => setImagemZoom(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2.5 bg-black/50 rounded-full cursor-pointer transition-colors z-20 backdrop-blur-md"
            aria-label="Fechar zoom"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={imagemZoom} 
            alt="Aviso ampliado" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl animate-modal-enter cursor-default"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
}
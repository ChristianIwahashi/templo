import { useEffect, useState } from "react";
import { Api } from "../../api/Api";
import { X, RefreshCw, AlertCircle, ZoomIn, ImageOff } from "lucide-react";

export interface FotoItem {
  idConteudo: number;
  titulo: string;
  texto?: string;
  midiaUrl: string;
}

export function Galeria() {
  const [fotos, setFotos] = useState<FotoItem[]>([]);
  const [fotoSelecionada, setFotoSelecionada] = useState<FotoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  async function carregarGaleria() {
    try {
      setLoading(true);
      setErro('');
      const response = await Api.get('/conteudo-informativo?categoria=GALERIA');
      setFotos(response.data || []);
    } catch (error) {
      console.error(error);
      setErro('Não foi possível carregar a galeria de fotos no momento.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarGaleria();
  }, []);

  return (
    <section className="space-y-12 animate-fade-in-up">
      
      {/*Cabeçalho*/}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0060ba] tracking-tight">
          Galeria de Fotos
        </h1>
        <p className="text-base sm:text-lg text-slate-600 opacity-90">
          Registros visuais das cerimônias tradicionais, celebrações culturais, missas e atividades educacionais do Templo Honpa Hongwanji de Lins.
        </p>
      </div>

      {/*Estado Carregamento*/}
      {loading && (
        <div className="flex flex-col justify-center items-center h-64 space-y-3">
          <RefreshCw className="w-8 h-8 text-[#0060ba] animate-spin" />
          <p className="text-slate-500 font-medium text-sm">Carregando acervo fotográfico...</p>
        </div>
      )}

      {/*Estado de Erro*/}
      {!loading && erro && (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 max-w-xl mx-auto text-center space-y-4">
          <AlertCircle className="w-10 h-10 mx-auto text-red-500" />
          <p className="font-semibold text-sm">{erro}</p>
          <button
            onClick={carregarGaleria}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/*Estado Vazio*/}
      {!loading && !erro && fotos.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center max-w-xl mx-auto border border-gray-150 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-[#0060ba] rounded-2xl flex items-center justify-center mx-auto mb-2">
            <ImageOff className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Nenhuma foto publicada</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            O acervo fotográfico do templo está sendo digitalizado. Em breve novas memórias e registros de nossos eventos estarão disponíveis aqui.
          </p>
        </div>
      )}

      {/*Grid Fotos*/}
      {!loading && !erro && fotos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fotos.map((foto) => (
            <div
              key={foto.idConteudo}
              onClick={() => setFotoSelecionada(foto)}
              className="relative group rounded-2xl overflow-hidden shadow-md aspect-4/3 bg-slate-150 cursor-pointer border border-gray-100"
            >
              <img 
                src={foto.midiaUrl} 
                alt={foto.titulo} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 absolute inset-0"
                loading="lazy"
              />

              {/*Overlay Escuro*/}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center z-10 backdrop-blur-[2px]">
                <ZoomIn className="w-8 h-8 text-white mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300" />
                <span className="text-white font-bold text-base sm:text-lg tracking-wide line-clamp-2">
                  {foto.titulo}
                </span>
                {foto.texto && (
                  <p className="text-xs text-slate-200 mt-1 line-clamp-2 opacity-90 max-w-xs">
                    {foto.texto}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/*Modal Visualização Tela Cheia*/}
      {fotoSelecionada && (
        <div 
          onClick={() => setFotoSelecionada(null)}
          className="fixed inset-0 bg-black/85 z-250 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out animate-fade-in-up"
        >
          {/*Botão de Fechar*/}
          <button 
            onClick={() => setFotoSelecionada(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2.5 bg-black/50 rounded-full cursor-pointer transition-colors z-20 backdrop-blur-md"
            aria-label="Fechar visualização"
          >
            <X className="w-6 h-6" />
          </button>

          {/*Container da Foto Ampliada*/}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-800 cursor-default"
          >
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-75">
              <img 
                src={fotoSelecionada.midiaUrl} 
                alt={fotoSelecionada.titulo} 
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>

            {/*Rodapé do Modal com Legenda*/}
            <div className="p-5 bg-slate-900 text-white border-t border-slate-800">
              <h3 className="text-lg font-bold text-white mb-1">
                {fotoSelecionada.titulo}
              </h3>
              {fotoSelecionada.texto && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {fotoSelecionada.texto}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
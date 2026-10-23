import { useEffect, useState } from "react";
import { Api } from "../../api/api";
import { Clock, Calendar, X, AlertCircle, MapPin, RefreshCw, CalendarX, HeartHandshake } from "lucide-react";

export interface EventoPublico {
  id: string | number;
  titulo: string;
  data: string;
  horario: string;
  imagemUrl?: string;
  descricaoCompleta: string;
}

export function Eventos() {
  const [eventos, setEventos] = useState<EventoPublico[]>([]);
  const [eventoSelecionado, setEventoSelecionado] = useState<EventoPublico | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  async function carregarEventosPublicos() {
    try {
      setLoading(true);
      setErro('');
      const response = await Api.get('/aviso-evento?ativo=true');
      
      const eventosFormatados: EventoPublico[] = (response.data || []).map((e: any) => ({
        id: e.idAvisoEvento,
        titulo: e.titulo,
        data: new Date(e.dataPostagem).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
        horario: 'Consulte a programação com a secretaria',
        imagemUrl: e.imagemUrl || undefined,
        descricaoCompleta: e.descricao
      }));
      setEventos(eventosFormatados);
    } catch (error) {
      console.error(error);
      setErro('Não foi possível carregar a programação de eventos no momento.');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    carregarEventosPublicos();
  }, []);

  return (
    <section className="space-y-12 animate-fade-in-up text-slate-800 dark:text-slate-100">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-templo-blue dark:text-sys-blue tracking-tight">
          Próximos Eventos
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 opacity-90">
          Acompanhe o cronograma de cerimônias tradicionais, celebrações culturais e festivais gastronômicos abertos à comunidade.
        </p>
      </div>

      {loading && (
        <div className="flex flex-col justify-center items-center h-64 space-y-3">
          <RefreshCw className="w-8 h-8 text-templo-blue animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Consultando a agenda oficial do templo...</p>
        </div>
      )}

      {!loading && erro && (
        <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 p-6 rounded-2xl border border-red-200 dark:border-red-900 max-w-xl mx-auto text-center space-y-4">
          <AlertCircle className="w-10 h-10 mx-auto text-red-500" />
          <p className="font-semibold text-sm">{erro}</p>
          <button
            onClick={carregarEventosPublicos}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {!loading && !erro && eventos.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center max-w-xl mx-auto border border-gray-150 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/50 text-templo-blue dark:text-sys-blue rounded-2xl flex items-center justify-center mx-auto mb-2">
            <CalendarX className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Nenhum evento agendado no momento</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Nossa programação de celebrações e festivais está sendo planejada. Acompanhe nossas notícias ou entre em contato com a secretaria para saber as próximas datas.
          </p>
        </div>
      )}

      {!loading && !erro && eventos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              onClick={() => setEventoSelecionado(evento)}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border-t-4 border-templo-blue dark:border-sys-blue border-x border-b border-gray-150 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full group"
            >
              <div className="h-52 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                {evento.imagemUrl ? (
                  <img 
                    src={evento.imagemUrl} 
                    alt={evento.titulo} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                ) : (
                  <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 bg-blue-100 dark:bg-blue-950/60 text-templo-blue dark:text-sys-blue">
                    Postado em {evento.data}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 leading-tight group-hover:text-templo-blue dark:group-hover:text-sys-blue transition-colors">
                    {evento.titulo}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed opacity-90 line-clamp-3">
                    {evento.descricaoCompleta}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-templo-blue dark:text-sys-blue pt-4 border-t border-gray-100 dark:border-slate-800">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span className="truncate">{evento.horario}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {eventoSelecionado && (
        <div 
          onClick={() => setEventoSelecionado(null)}
          className="fixed inset-0 bg-black/60 z-200 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xs transition-opacity"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-modal-enter flex flex-col max-h-[90vh] border border-gray-100 dark:border-slate-800"
          >
            {eventoSelecionado.imagemUrl && (
              <div className="relative h-56 sm:h-72 w-full shrink-0 bg-gray-100 dark:bg-slate-800">
                <img 
                  src={eventoSelecionado.imagemUrl} 
                  alt={eventoSelecionado.titulo} 
                  className="w-full h-full object-cover" 
                />
                <button 
                  onClick={() => setEventoSelecionado(null)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full transition-colors cursor-pointer backdrop-blur-md"
                  aria-label="Fechar modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="p-6 sm:p-8 overflow-y-auto acc-scrollbar flex-1 space-y-6 text-slate-700 dark:text-slate-200">
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold mb-3 bg-blue-100 dark:bg-blue-950/60 text-templo-blue dark:text-sys-blue">
                  Data: {eventoSelecionado.data}
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                  {eventoSelecionado.titulo}
                </h2>
                <div className="flex items-center gap-2 font-semibold text-sm text-templo-blue dark:text-sys-blue mt-2">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>{eventoSelecionado.horario}</span>
                </div>
              </div>

              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">
                {eventoSelecionado.descricaoCompleta}
              </p>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-150 dark:border-slate-700 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-templo-blue dark:text-sys-blue shrink-0 mt-0.5" />
                <span>
                  <strong>Local:</strong> Templo Honpa Hongwanji de Lins — Rua 9 de Julho, 1455, Centro, Lins - SP.
                </span>
              </div>

              <div className="p-4 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 rounded-2xl flex items-center gap-3 text-sm text-templo-blue dark:text-sys-blue">
                <HeartHandshake className="w-6 h-6 shrink-0" />
                <div>
                  <p className="font-bold">Entrada Livre — Todos são bem-vindos!</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Não é necessário inscrição prévia para participar de nossas cerimônias e festividades.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
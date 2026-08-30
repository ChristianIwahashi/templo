import { useEffect, useState } from "react";
import { Api } from "../../api/Api";
import { Clock, Info, BookOpen, X, ZoomIn } from "lucide-react";
import { InfoAuditoria, type AutorAuditoria } from "../../components/InfoAuditoria";

interface AvisoAula {
    idAvisoAula: number;
    titulo: string;
    dataPostagem: string;
    imagemUrl?: string;
    professor: { usuario: { nome: string } };
    criadoEm?: string;
    atualizadoEm?: string;
    criadoPor?: AutorAuditoria | null;
    atualizadoPor?: AutorAuditoria | null;
}

const MESES = [
    { valor: '0', nome: 'Janeiro' },
    { valor: '1', nome: 'Fevereiro' },
    { valor: '2', nome: 'Março' },
    { valor: '3', nome: 'Abril' },
    { valor: '4', nome: 'Maio' },
    { valor: '5', nome: 'Junho' },
    { valor: '6', nome: 'Julho' },
    { valor: '7', nome: 'Agosto' },
    { valor: '8', nome: 'Setembro' },
    { valor: '9', nome: 'Outubro' },
    { valor: '10', nome: 'Novembro' },
    { valor: '11', nome: 'Dezembro' },
];

export function Avisos() {
    const [avisos, setAvisos] = useState<AvisoAula[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [filtroMes, setFiltroMes] = useState<string>('todos');
    const [filtroAno, setFiltroAno] = useState<string>('todos');
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

    //Filtro
    const anosDisponiveis = Array.from(
        new Set(avisos.map(a => new Date(a.dataPostagem).getUTCFullYear()))
    ).sort((a, b) => b - a);

    const avisosFiltrados = avisos.filter((aviso) => {
        const data = new Date(aviso.dataPostagem);
        const matchesAno = filtroAno === 'todos' ? true : data.getUTCFullYear().toString() === filtroAno;
        const matchesMes = filtroMes === 'todos' ? true : data.getUTCMonth().toString() === filtroMes;

        return matchesAno && matchesMes;
    });

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
                <p className="text-gray-500 font-medium animate-pulse">Carregando...</p>
            </div>
        );
    }
    if (erro) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 font-semibold text-center">
                    {erro}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in-up relative">
            <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-sys-blue" />
                <h2 className="text-2xl font-bold text-gray-800">Avisos de Aula</h2>
            </div>

            {/*Filtros*/}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
                {/*Filtro por Ano*/}
                <div className="flex-1 min-w-37.5">
                    <label htmlFor="filtro-ano" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 items-center gap-1.5">
                        Ano
                    </label>
                    <select
                        id="filtro-ano"
                        value={filtroAno}
                        onChange={e => setFiltroAno(e.target.value)}
                        className="w-full p-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 cursor-pointer"
                    >
                        <option value="todos">Todos os anos</option>
                        {anosDisponiveis.map(ano => (
                            <option key={ano} value={ano.toString()}>{ano}</option>
                        ))}
                    </select>
                </div>

                {/*Filtro por Mês*/}
                <div className="flex-1 min-w-37.5">
                    <label htmlFor="filtro-mes" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Mês
                    </label>
                    <select
                        id="filtro-mes"
                        value={filtroMes}
                        onChange={e => setFiltroMes(e.target.value)}
                        className="w-full p-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 cursor-pointer"
                    >
                        <option value="todos">Todos os meses</option>
                        {MESES.map(mes => (
                            <option key={mes.valor} value={mes.valor}>{mes.nome}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/*Lista de Avisos*/}
            <div className="space-y-4">
                {avisosFiltrados.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-gray-150 text-center text-gray-500">
                        <Info className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="font-semibold">Nenhum recado encontrado para o período selecionado.</p>
                    </div>
                ) : (
                    avisosFiltrados.map((aviso) => (
                        <div key={aviso.idAvisoAula} className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition overflow-hidden">
                            <div className="p-6 space-y-4">

                                {/* Cabeçalho */}
                                <div className="flex flex-wrap justify-between items-start gap-2 border-b border-gray-100 pb-3">
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg leading-tight">{aviso.titulo}</h4>

                                        <div className="flex items-center gap-2 text-xs text-sys-blue font-semibold mt-1.5">
                                            <span>Prof: {aviso.professor.usuario.nome}</span>
                                            <InfoAuditoria
                                                criadoPor={aviso.criadoPor}
                                                atualizadoPor={aviso.atualizadoPor}
                                            />
                                        </div>
                                    </div>

                                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" /> {formatarData(aviso.dataPostagem)}
                                    </span>
                                </div>

                                {/*Imagem*/}
                                {aviso.imagemUrl && (
                                    <div
                                        onClick={() => setImagemZoom(aviso.imagemUrl || null)}
                                        className="relative rounded-xl overflow-hidden h-64 sm:h-80 bg-gray-50 border border-gray-100 flex items-center justify-center cursor-pointer group"
                                        title="Clique para ver em tamanho cheio"
                                    >
                                        <img
                                            src={aviso.imagemUrl}
                                            alt="Anexo do aviso"
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
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

            {/*Zoom*/}
            {imagemZoom && (
                <div
                    onClick={() => setImagemZoom(null)}
                    className="fixed inset-0 bg-black/80 z-300 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
                >
                    <button
                        onClick={() => setImagemZoom(null)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 bg-black/40 rounded-full cursor-pointer transition-colors"
                    >
                        <X className="w-8 h-8" />
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
import { useEffect, useState } from "react";
import { Api } from "../../api/Api";
import { GraduationCap, CheckCircle, BookOpen, ChevronUp, ChevronDown, Calendar, XCircle } from "lucide-react";
import { formatarData } from '../../utils/formatters';
import { calcularMediaGeral, calcularPercentualFrequencia } from '../../utils/calculations';
import { InfoAuditoria, type AutorAuditoria } from "../../components/InfoAuditoria";

interface Nota {
    idNota: number;
    valor: number;
    tipo: string;
    data: string;
    professor: { usuario: { nome: string } };
    criadoEm?: string;
    atualizadoEm?: string;
    criadoPor?: AutorAuditoria | null;
    atualizadoPor?: AutorAuditoria | null;
}
interface Frequencia {
    idFrequencia: number;
    dataAula: string;
    presenca: boolean;
    professor: { usuario: { nome: string } };
    criadoEm?: string;
    atualizadoEm?: string;
    criadoPor?: AutorAuditoria | null;
    atualizadoPor?: AutorAuditoria | null;
}

export function Historico() {
    const [notas, setNotas] = useState<Nota[]>([]);
    const [frequencias, setFrequencias] = useState<Frequencia[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [filtroAno, setFiltroAno] = useState<string>(new Date().getFullYear().toString());
    const [showFrequenciaDetalhes, setShowFrequenciaDetalhes] = useState(false);

    useEffect(() => {
        async function carregarDadosAcademicos() {
            try {
                setLoading(true);

                const [notasResponse, frequenciasResponse] = await Promise.all([
                    Api.get('/nota'),
                    Api.get('/frequencia')
                ]);

                setNotas(notasResponse.data);
                setFrequencias(frequenciasResponse.data);
            } catch (error) {
                console.error(error);
                setErro('Não foi possível carregar o seu histórico acadêmico.');
            } finally {
                setLoading(false);
            }
        }

        carregarDadosAcademicos();
    }, []);

    //Filtro de Ano
    const anosNotas = notas.map(n => new Date(n.data).getUTCFullYear());
    const anosFrequencias = frequencias.map(f => new Date(f.dataAula).getUTCFullYear());

    const anosDisponiveis = Array.from(new Set([...anosNotas, ...anosFrequencias])).sort((a, b) => b - a);

    const notasFiltradas = notas.filter(n =>
        new Date(n.data).getUTCFullYear().toString() === filtroAno
    );
    const frequenciasFiltradas = frequencias.filter(f =>
        new Date(f.dataAula).getUTCFullYear().toString() === filtroAno
    );

    const mediaGeral = calcularMediaGeral(notasFiltradas);
    const percentualFrequencia = calcularPercentualFrequencia(frequenciasFiltradas);
    const totalAulas = frequenciasFiltradas.length;
    const presencas = frequenciasFiltradas.filter(f => f.presenca).length;

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
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border 
                border-red-200 font-semibold text-center">
                    {erro}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in-up">

            {/* Filtro de Ano*/}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-end">
                <div className="w-full sm:w-72">
                    <label htmlFor="filtro-ano" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 items-center gap-1.5">
                        Filtrar por Ano
                    </label>
                    <select
                        id="filtro-ano"
                        value={filtroAno}
                        onChange={e => setFiltroAno(e.target.value)}
                        className="w-full p-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 cursor-pointer"
                    >
                        {anosDisponiveis.map(ano => (
                            <option key={ano} value={ano.toString()}>{ano}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Frequência*/}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 
                flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">Frequência</h3>
                                <p className="text-sm text-gray-500">
                                    Presenças: {presencas} de {totalAulas} aulas
                                </p>
                            </div>
                        </div>
                        <div className={`text-4xl font-extrabold ${percentualFrequencia === null
                            ? 'text-gray-400'
                            : percentualFrequencia >= 75 ? 'text-green-500' : 'text-red-500'
                            }`}>
                            {percentualFrequencia === null ? '-' : `${percentualFrequencia}%`}
                        </div>
                    </div>

                    {/* Botão de Expandir/Recolher*/}
                    {totalAulas > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setShowFrequenciaDetalhes(!showFrequenciaDetalhes)}
                                className="flex items-center gap-1.5 text-sm font-semibold 
                                text-sys-blue hover:text-sys-blue-hover cursor-pointer transition-all"
                            >
                                <span>{showFrequenciaDetalhes ? 'Ocultar detalhes' : 'Ver histórico detalhado'}</span>
                                {showFrequenciaDetalhes ? <ChevronUp className="w-4 h-4" /> :
                                    <ChevronDown className="w-4 h-4" />}
                            </button>
                        </div>
                    )}
                </div>

                {/*Média Geral*/}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 
                flex items-center justify-between h-full">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-sys-blue rounded-xl">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">Média Geral</h3>
                            <p className="text-sm text-gray-500">
                                Baseado em {notasFiltradas.length} avaliações
                            </p>
                        </div>
                    </div>
                    <div className={`text-4xl font-extrabold ${mediaGeral === null
                        ? 'text-gray-400'
                        : mediaGeral >= 6.0 ? 'text-sys-blue' : 'text-red-500'
                        }`}>
                        {mediaGeral === null ? '-' : mediaGeral.toFixed(1)}
                    </div>
                </div>
            </div>

            {/* Frequência Detalhada */}
            {showFrequenciaDetalhes && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
                    
                    <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <h4 className="font-bold text-gray-700">Histórico de Presenças</h4>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 text-sm text-gray-600 bg-gray-50/30">
                                    <th className="p-4 font-semibold">Data da Aula</th>
                                    <th className="p-4 font-semibold">Professor</th>
                                    <th className="p-4 font-semibold text-center">Situação</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {frequenciasFiltradas.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-gray-500 font-medium">
                                            Nenhum registro de frequência encontrado para o período selecionado.
                                        </td>
                                    </tr>
                                ) : (
                                    frequenciasFiltradas.map((freq) => (
                                        <tr key={freq.idFrequencia} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 font-semibold text-gray-800 flex items-center justify-between gap-2">
                                                <span>{formatarData(freq.dataAula)}</span>
                                                <InfoAuditoria
                                                    criadoPor={freq.criadoPor}
                                                    atualizadoPor={freq.atualizadoPor}
                                                />
                                            </td>

                                            <td className="p-4 text-gray-600">
                                                {freq.professor.usuario.nome}
                                            </td>

                                            <td className="p-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border
                                                    ${freq.presenca
                                                        ? 'bg-green-100 text-green-700 border-green-200'
                                                        : 'bg-red-100 text-red-700 border-red-200'
                                                    }
                                                `}>
                                                    {freq.presenca ? (
                                                        <>
                                                            <CheckCircle className="w-3.5 h-3.5" /> Presente
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-3.5 h-3.5" /> Falta
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/*BOLETIM DE NOTAS*/}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-sys-blue" />
                    <h4 className="font-bold text-gray-700">Boletim de Notas</h4>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 text-sm text-gray-600 bg-gray-50/30">
                                <th className="p-4 font-semibold">Avaliação / Atividade</th>
                                <th className="p-4 font-semibold">Professor</th>
                                <th className="p-4 font-semibold">Data</th>
                                <th className="p-4 font-semibold">Nota</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {notasFiltradas.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500 font-medium">
                                        Nenhuma nota lançada neste período letivo.
                                    </td>
                                </tr>
                            ) : (
                                notasFiltradas.map((nota) => (
                                    <tr key={nota.idNota} className="border-b border-gray-100 
                                    hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-semibold text-gray-800 flex items-center justify-between gap-2">
                                            <span>{nota.tipo}</span>
                                            <InfoAuditoria
                                                criadoPor={nota.criadoPor}
                                                atualizadoPor={nota.atualizadoPor}
                                            />
                                        </td>
                                        <td className="p-4 text-gray-600">{nota.professor.usuario.nome}</td>
                                        <td className="p-4 text-gray-600">{formatarData(nota.data)}</td>
                                        <td className={`p-4 font-bold text-lg ${nota.valor >= 7.0 ?
                                            'text-sys-blue' : 'text-red-500'}`}>
                                            {nota.valor.toFixed(1)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}
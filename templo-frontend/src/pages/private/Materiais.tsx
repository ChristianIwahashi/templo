import { useEffect, useState } from "react";
import { Api } from "../../api/Api";
import { FileText, Download, FolderOpen, Info } from "lucide-react";
import { InfoAuditoria, type AutorAuditoria } from "../../components/InfoAuditoria";

interface Material {
    idMaterial: number;
    titulo: string;
    descricao: string;
    arquivoUrl: string;
    dataPostagem: string;
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

export function Materiais() {
    const [materiais, setMateriais] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [filtroMes, setFiltroMes] = useState<string>('todos');
    const [filtroAno, setFiltroAno] = useState<string>('todos');

    useEffect(() => {
        async function carregarMateriaisDoAluno() {
            try {
                setLoading(true);
                const response = await Api.get('/material-didatico/meus-materiais');
                setMateriais(response.data);
            } catch (error) {
                console.error(error);
                setErro('Não foi possível carregar os seus materiais didáticos.');
            } finally {
                setLoading(false);
            }
        }

        carregarMateriaisDoAluno();
    }, []);

    //Filtro
    const anosDisponiveis = Array.from(
        new Set(materiais.map(m => new Date(m.dataPostagem).getUTCFullYear()))
    ).sort((a, b) => b - a);

    const materiaisFiltrados = materiais.filter((m) => {
        const data = new Date(m.dataPostagem);
        const matchesAno = filtroAno === 'todos' ? true : data.getUTCFullYear().toString() === filtroAno;
        const matchesMes = filtroMes === 'todos' ? true : data.getUTCMonth().toString() === filtroMes;

        return matchesAno && matchesMes;
    });

    function formatarData(dataStr: string) {
        return new Date(dataStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
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
        <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in-up">

            {/*Filtro*/}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end">

                {/*Filtro por Ano*/}
                <div className="w-full md:w-44">
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
                <div className="w-full md:w-44">
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

            {/*Materiais*/}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-sys-blue" />
                    <h4 className="font-bold text-gray-700">Material de Estudo Disponível</h4>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 text-sm text-gray-600 bg-gray-50/30">
                                <th className="p-4 font-semibold">Arquivo / Lição</th>
                                <th className="p-4 font-semibold">Descrição</th>
                                <th className="p-4 font-semibold">Postado em</th>
                                <th className="p-4 font-semibold">Professor</th>
                                <th className="p-4 font-semibold text-center">Download</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {materiaisFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">
                                        <Info className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                        Nenhum material encontrado com os filtros atuais.
                                    </td>
                                </tr>
                            ) : (
                                materiaisFiltrados.map((m) => (
                                    <tr key={m.idMaterial} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">

                                        <td className="p-4 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <FileText className="text-red-500 w-6 h-6 shrink-0" />
                                                <span className="font-semibold text-gray-800 block leading-tight">{m.titulo}</span>
                                            </div>
                                            <InfoAuditoria
                                                criadoPor={m.criadoPor}
                                                atualizadoPor={m.atualizadoPor}
                                            />
                                        </td>
                                        <td className="p-4 text-gray-600 max-w-xs" title={m.descricao}>
                                            <p className="line-clamp-2 text-xs leading-relaxed">
                                                {m.descricao}
                                            </p>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {formatarData(m.dataPostagem)}
                                        </td>
                                        <td className="p-4 text-gray-600 font-medium">
                                            {m.professor.usuario.nome}
                                        </td>

                                        <td className="p-4 text-center">
                                            <a
                                                href={m.arquivoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center p-2 rounded-lg bg-blue-50 text-sys-blue hover:bg-sys-blue hover:text-white transition-all cursor-pointer"
                                                title="Abrir / Baixar arquivo"
                                            >
                                                <Download className="w-5 h-5" />
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
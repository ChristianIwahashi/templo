import { useEffect, useState } from "react";
import { Api } from "../../api/api";
import { GraduationCap, CheckCircle, BookOpen } from "lucide-react";

interface Nota {
  idNota: number;
  valor: number;
  tipo: string;
  data: string;
  professor: { usuario: { nome: string } };
}
interface Frequencia {
  idFrequencia: number;
  dataAula: string;
  presenca: boolean;
  professor: { usuario: { nome: string } };
}

export function Historico() {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [frequencias, setFrequencias] = useState<Frequencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [filtroAno, setFiltroAno] = useState<string>('todos');

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

  const anosNotas = notas.map(n => new Date(n.data).getUTCFullYear());
  const anosFrequencias = frequencias.map(f => new Date(f.dataAula).getUTCFullYear());
  const anosDisponiveis = Array.from(new Set([...anosNotas, ...anosFrequencias])).sort((a, b) => b - a);

  const notasFiltradas = notas.filter(n => 
    filtroAno === 'todos' ? true : new Date(n.data).getUTCFullYear().toString() === filtroAno
  );

  const frequenciasFiltradas = frequencias.filter(f => 
    filtroAno === 'todos' ? true : new Date(f.dataAula).getUTCFullYear().toString() === filtroAno
  );

  const somaNotas = notasFiltradas.reduce((acc, nota) => acc + nota.valor, 0);
  const mediaGeral = notasFiltradas.length > 0 ? somaNotas / notasFiltradas.length : 0;

  const totalAulas = frequenciasFiltradas.length;
  const presencas = frequenciasFiltradas.filter(f => f.presenca).length;
  const percentualFrequencia = totalAulas > 0 ? Math.round((presencas / totalAulas) * 100) : 0;

  function formatarData(dataStr: string) {
    return new Date(dataStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-slate-400 font-medium animate-pulse">Carregando diário de classe...</p>
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
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in-up text-slate-800 dark:text-slate-100">
      
      {/*Filtro por Ano*/}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-150 dark:border-slate-800 flex items-end">
        <div className="w-full sm:w-72">
          <label htmlFor="filtro-ano" className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            Filtrar por Ano Letivo
          </label>
          <select 
            id="filtro-ano"
            value={filtroAno}
            onChange={e => setFiltroAno(e.target.value)}
            className="w-full p-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 cursor-pointer font-medium"
          >
            <option value="todos">Todos os anos (Histórico Acumulado)</option>
            {anosDisponiveis.map(ano => (
              <option key={ano} value={ano.toString()}>{ano}</option>
            ))}
          </select>
        </div>
      </div>

      {/*Cards de Resumo*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-xl">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-slate-100 text-lg">Frequência Escolar</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Presenças: <strong className="text-gray-700 dark:text-slate-200">{presencas}</strong> de {totalAulas} aulas
              </p>
            </div>
          </div>
          <div className={`text-4xl font-extrabold ${percentualFrequencia >= 75 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
            {percentualFrequencia}%
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-sys-blue rounded-xl">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-slate-100 text-lg">Média Geral</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Baseado em {notasFiltradas.length} avaliações
              </p>
            </div>
          </div>
          <div className={`text-4xl font-extrabold ${mediaGeral >= 7.0 ? 'text-sys-blue' : 'text-red-500 dark:text-red-400'}`}>
            {mediaGeral.toFixed(1)}
          </div>
        </div>
      </div>

      {/*Boletim de Notas*/}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-150 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/60 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sys-blue" />
          <h4 className="font-bold text-gray-700 dark:text-slate-100">Boletim de Notas</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700 text-sm text-gray-600 dark:text-slate-300 bg-gray-50/30 dark:bg-slate-800/40">
                <th className="p-4 font-semibold">Avaliação / Atividade</th>
                <th className="p-4 font-semibold">Professor</th>
                <th className="p-4 font-semibold">Data</th>
                <th className="p-4 font-semibold">Nota</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-slate-800">
              {notasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 dark:text-slate-400 font-medium">
                    Nenhuma nota lançada neste período letivo.
                  </td>
                </tr>
              ) : (
                notasFiltradas.map((nota) => (
                  <tr key={nota.idNota} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-semibold text-gray-800 dark:text-slate-100">{nota.tipo}</td>
                    <td className="p-4 text-gray-600 dark:text-slate-300">{nota.professor.usuario.nome}</td>
                    <td className="p-4 text-gray-600 dark:text-slate-300">{formatarData(nota.data)}</td>
                    <td className={`p-4 font-bold text-lg ${nota.valor >= 7.0 ? 'text-sys-blue' : 'text-red-500 dark:text-red-400'}`}>
                      {nota.valor.toFixed(1)}
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
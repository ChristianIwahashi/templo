import { UseRelatorio } from "../../hooks/UseRelatorio";
import { formatarDinheiro } from "../../utils/formatters";
import { PieChart, FileSpreadsheet, Download, AlertCircle, Check, Loader2 } from "lucide-react";

interface Turma {
  idTurma: number;
}
interface LinhaAcademica {
  idUsuario: number;
  nome: string;
  frequencia: number;
  media: number;
  totalNotas: number;
  totalAulas: number;
}
interface LinhaFinanceira {
  nome: string;
  parcelasPagas: number;
  parcelasPendentes: number;
  valorPendente: number;
}

export function Relatorio() {
  const {
    user,
    tipoRelatorio,
    setTipoRelatorio,
    turmaSelecionada,
    setTurmaSelecionada,
    anoSelecionado,
    setAnoRef,
    dadosPrevia,
    turmas,
    anosDisponiveis,
    loading,
    loadingTurmas,
    salvando,
    erro,
    sucesso,
    toastMessage,
    executarGerarRelatorio,
    exportarParaPlanilha
  } = UseRelatorio();

  if (loadingTurmas) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-slate-400 font-medium animate-pulse">Carregando filtros de relatórios...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in-up relative text-slate-800 dark:text-slate-100">

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-green-400 px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce border border-gray-800">
          <Download className="w-5 h-5 animate-pulse" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/*Título*/}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 pb-4">
        <PieChart className="w-6 h-6 text-sys-blue" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Exportar Relatórios</h2>
      </div>

      {/*Alertas*/}
      {erro && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-xl border border-red-150 dark:border-red-900 flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
        </div>
      )}
      {sucesso && (
        <div className="p-4 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 rounded-xl border border-green-150 dark:border-green-900 flex items-center gap-2 font-semibold">
          <Check className="w-4 h-4 shrink-0" /> {sucesso}
        </div>
      )}

      {/*Grid Duas Colunas*/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/*Filtros*/}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 h-fit space-y-5 md:col-span-1">
          <h3 className="font-bold text-gray-800 dark:text-slate-100 text-sm flex items-center gap-1.5 border-b border-gray-100 dark:border-slate-800 pb-2">
            Filtros de Exportação
          </h3>

          <form onSubmit={e => { e.preventDefault(); executarGerarRelatorio(); }} className="space-y-4 text-sm">

            {user?.papel === 'GESTOR' && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1.5">Tipo de Dados</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-gray-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => { setTipoRelatorio('academico'); }}
                    className={`py-2 rounded-lg font-bold text-xs transition-all cursor-pointer
                      ${tipoRelatorio === 'academico' ? 'bg-white dark:bg-slate-900 text-sys-blue shadow-sm' : 'text-gray-500 dark:text-slate-400'}
                    `}
                  >
                    Acadêmico
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTipoRelatorio('financeiro'); }}
                    className={`py-2 rounded-lg font-bold text-xs transition-all cursor-pointer
                      ${tipoRelatorio === 'financeiro' ? 'bg-white dark:bg-slate-900 text-green-600 dark:text-green-400 shadow-sm' : 'text-gray-500 dark:text-slate-400'}
                    `}
                  >
                    Financeiro
                  </button>
                </div>
              </div>
            )}

            {tipoRelatorio === 'academico' && (
              <div>
                <label htmlFor="select-turma-rel" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Turma *</label>
                <select
                  id="select-turma-rel"
                  value={turmaSelecionada}
                  onChange={e => setTurmaSelecionada(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 cursor-pointer font-medium"
                  required
                >
                  <option value="">Selecione...</option>
                  {turmas.map((t: Turma) => (
                    <option key={t.idTurma} value={t.idTurma}>Turma {t.idTurma}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="select-ano-rel" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Ano Letivo *</label>
              <select
                id="select-ano-rel"
                value={anoSelecionado}
                onChange={e => setAnoRef(e.target.value)}
                className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 cursor-pointer font-medium"
                required
              >
                {anosDisponiveis.length === 0 ? (
                  <option value="">Nenhum registro encontrado</option>
                ) : (
                  anosDisponiveis.map(ano => (
                    <option key={ano} value={ano.toString()}>{ano}</option>
                  ))
                )}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all cursor-pointer shadow-md flex items-center justify-center gap-2
                ${tipoRelatorio === 'financeiro'
                  ? 'bg-green-600 hover:bg-green-700 shadow-green-100 dark:shadow-none'
                  : 'bg-sys-blue hover:bg-sys-blue-hover shadow-blue-100 dark:shadow-none'
                }
              `}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Gerar Pré-visualização'}
            </button>
          </form>
        </div>

        {/*Prévia*/}
        <div className="md:col-span-2 space-y-4">
          {dadosPrevia.length > 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">

              <div className="p-4 bg-gray-50/50 dark:bg-slate-800/60 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-slate-100 text-sm">Dados Consolidados</h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Visualize a prévia antes de exportar</p>
                </div>

                <button
                  onClick={exportarParaPlanilha}
                  disabled={salvando}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md
                    ${tipoRelatorio === 'financeiro'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-sys-blue hover:bg-sys-blue-hover'
                    }
                  `}
                >
                  <FileSpreadsheet className="w-4 h-4" /> Exportar para Excel (.xlsx)
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  {tipoRelatorio === 'academico' ? (
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-500 dark:text-slate-400 uppercase bg-gray-50/20 dark:bg-slate-800/40">
                        <th className="p-4 font-semibold">Nome do Aluno</th>
                        <th className="p-4 font-semibold text-center">Frequência</th>
                        <th className="p-4 font-semibold text-center">Média Geral</th>
                        <th className="p-4 font-semibold text-center">Aulas Assistidas</th>
                      </tr>
                    </thead>
                  ) : (
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-500 dark:text-slate-400 uppercase bg-gray-50/20 dark:bg-slate-800/40">
                        <th className="p-4 font-semibold">Nome do Aluno</th>
                        <th className="p-4 font-semibold text-center">Mensalidades Pagas</th>
                        <th className="p-4 font-semibold text-center">Mensalidades Pendentes</th>
                        <th className="p-4 font-semibold text-right">Inadimplência Acumulada</th>
                      </tr>
                    </thead>
                  )}

                  <tbody className="text-sm divide-y divide-gray-100 dark:divide-slate-800">
                    {tipoRelatorio === 'academico' ? (
                      (dadosPrevia as LinhaAcademica[]).map((linha: LinhaAcademica, index: number) => (
                        <tr key={linha.idUsuario || index} className="hover:bg-gray-50/20 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="p-4 font-semibold text-gray-800 dark:text-slate-100">{linha.nome}</td>
                          <td className={`p-4 text-center font-bold ${linha.frequencia >= 75 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>{linha.frequencia}%</td>
                          <td className={`p-4 text-center font-bold ${(linha.media ?? 0) >= 7.0 ? 'text-sys-blue' : 'text-red-500'}`}>
                            {typeof linha.media === 'number' ? linha.media.toFixed(1) : '-'}</td>
                          <td className="p-4 text-center text-gray-500 dark:text-slate-400">{linha.totalAulas} aulas</td>
                        </tr>
                      ))
                    ) : (
                      (dadosPrevia as LinhaFinanceira[]).map((linha: LinhaFinanceira, index: number) => (
                        <tr key={index} className="hover:bg-gray-50/20 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="p-4 font-semibold text-gray-800 dark:text-slate-100">{linha.nome}</td>
                          <td className="p-4 text-center font-bold text-green-600 dark:text-green-400">{linha.parcelasPagas} parcelas</td>
                          <td className="p-4 text-center font-bold text-yellow-600 dark:text-yellow-400">{linha.parcelasPendentes} parcelas</td>
                          <td className={`p-4 text-right font-bold ${linha.valorPendente > 0 ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                            {formatarDinheiro(linha.valorPendente)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-gray-300 dark:border-slate-800 p-12 text-center flex flex-col items-center justify-center h-full min-h-75">
              <FileSpreadsheet className="w-10 h-10 text-gray-400 dark:text-slate-600 mb-3 animate-pulse" />
              <h4 className="font-bold text-gray-700 dark:text-slate-200">Prévia de Dados</h4>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">Configure os filtros na barra lateral esquerda e gere a visualização antes de baixar o documento consolidado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
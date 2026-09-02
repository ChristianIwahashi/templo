import { UseRelatorio } from "../../hooks/UseRelatorio";
import { formatarDinheiro } from "../../utils/formatters";
import { PieChart, Filter, FileSpreadsheet, Download, AlertCircle, Check, Loader2 } from "lucide-react";

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
    trocarTipoRelatorio,
    turmaSelecionada,
    setTurmaSelecionada,
    anoSelecionado,
    setAnoRef,
    dadosPrevia,
    turmas,
    loading,
    loadingTurmas,
    salvando,
    erro,
    sucesso,
    toastMessage,
    executarGerarRelatorio,
    exportarParaPlanilha,
    anosDisponiveis
  } = UseRelatorio();

  if (loadingTurmas) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 font-medium animate-pulse">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in-up relative">

      {/*Toast download*/}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-green-400 px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce border border-gray-800">
          <Download className="w-5 h-5 animate-pulse" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/*Título*/}
      <div className="flex items-center gap-2 pb-4">
        <PieChart className="w-6 h-6 text-sys-blue" />
        <h2 className="text-2xl font-bold text-gray-800">Exportar Relatórios</h2>
      </div>

      {/*Alertas Global*/}
      {erro && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-150 flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
        </div>
      )}
      {sucesso && (
        <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-150 flex items-center gap-2 font-semibold">
          <Check className="w-4 h-4 shrink-0" /> {sucesso}
        </div>
      )}

      {/*Layout*/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/*Painel de Filtros*/}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit space-y-5 md:col-span-1">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5 border-b pb-2">
            <Filter className="w-4 h-4 text-sys-blue" /> Filtros de Exportação
          </h3>

          <form onSubmit={e => { e.preventDefault(); executarGerarRelatorio(); }} className="space-y-4 text-sm">

            {/*Tipo de Relatório*/}
            {user?.papel === 'GESTOR' && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Tipo de Dados</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border-slate-100">
                  <button
                    type="button"
                    onClick={() => trocarTipoRelatorio('academico')}
                    className={`py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${tipoRelatorio === 'academico' ? 'bg-white text-sys-blue shadow-sm' : 'text-gray-500'
                      }`}
                  >
                    Acadêmico
                  </button>
                  <button
                    type="button"
                    onClick={() => trocarTipoRelatorio('financeiro')}
                    className={`py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${tipoRelatorio === 'financeiro' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'
                      }`}
                  >
                    Financeiro
                  </button>
                </div>
              </div>
            )}

            {/*Filtro por Turma*/}
            {tipoRelatorio === 'academico' && (
              <div>
                <label htmlFor="select-turma-rel" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Turma *</label>
                <select
                  id="select-turma-rel"
                  value={turmaSelecionada}
                  onChange={e => setTurmaSelecionada(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 cursor-pointer font-medium"
                  required
                >
                  <option value="">Selecione...</option>
                  {turmas.map((t: Turma) => (
                    <option key={t.idTurma} value={t.idTurma}>Turma {t.idTurma}</option>
                  ))}
                </select>
              </div>
            )}

            {/*Filtro por Ano*/}
            <div>
              <label htmlFor="select-ano-rel" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Ano Letivo *</label>
              <select
                id="select-ano-rel"
                value={anoSelecionado}
                onChange={e => setAnoRef(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 cursor-pointer font-medium"
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
                  ? 'bg-green-600 hover:bg-green-700 shadow-green-100'
                  : 'bg-sys-blue hover:bg-sys-blue-hover shadow-blue-100'
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processando...
                </>
              ) : (
                'Gerar Pré-visualização'
              )}
            </button>
          </form>
        </div>

        {/*Pré-visualização dos Dados*/}
        <div className="md:col-span-2 space-y-4">
          {dadosPrevia.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

              {/*Topo*/}
              <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Dados Consolidados</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Visualize a prévia antes de exportar</p>
                </div>

                <button
                  onClick={exportarParaPlanilha}
                  disabled={salvando}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md
                    ${tipoRelatorio === 'financeiro'
                      ? 'bg-green-600 hover:bg-green-700 shadow-green-100'
                      : 'bg-sys-blue hover:bg-sys-blue-hover shadow-blue-100'
                    }
                  `}
                >
                  <FileSpreadsheet className="w-4 h-4" /> Exportar para Excel (.xlsx)
                </button>
              </div>

              {/*Tabela de Prévia*/}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  {tipoRelatorio === 'academico' ? (
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-500 uppercase bg-gray-50/20">
                        <th className="p-4 font-semibold">Nome do Aluno</th>
                        <th className="p-4 font-semibold text-center">Frequência</th>
                        <th className="p-4 font-semibold text-center">Média Geral</th>
                        <th className="p-4 font-semibold text-center">Aulas Assistidas</th>
                      </tr>
                    </thead>
                  ) : (
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-500 uppercase bg-gray-50/20">
                        <th className="p-4 font-semibold">Nome do Aluno</th>
                        <th className="p-4 font-semibold text-center">Mensalidades Pagas</th>
                        <th className="p-4 font-semibold text-center">Mensalidades Pendentes</th>
                        <th className="p-4 font-semibold text-right">Inadimplência Acumulada</th>
                      </tr>
                    </thead>
                  )}

                  {/*Corpo*/}
                  <tbody className="text-sm">
                    {tipoRelatorio === 'academico' ? (
                      (dadosPrevia as LinhaAcademica[]).map((linha: LinhaAcademica) => (
                        <tr key={linha.idUsuario || Math.random()} className="border-b border-gray-100 hover:bg-gray-50/20 transition-colors">
                          <td className="p-4 font-semibold text-gray-800">{linha.nome || '-'}</td>
                          <td className={`p-4 text-center font-bold ${(linha.frequencia ?? 0) >= 75 ? 'text-green-600' : 'text-red-500'}`}>
                            {linha.frequencia ?? 0}%
                          </td>
                          <td className={`p-4 text-center font-bold ${(linha.media ?? 0) >= 7.0 ? 'text-sys-blue' : 'text-red-500'}`}>
                            {typeof linha.media === 'number' ? linha.media.toFixed(1) : '0.0'}
                          </td>
                          <td className="p-4 text-center text-gray-500">{linha.totalAulas ?? 0} aulas</td>
                        </tr>
                      ))
                    ) : (
                      (dadosPrevia as LinhaFinanceira[]).map((linha: LinhaFinanceira, index: number) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/20 transition-colors">
                          <td className="p-4 font-semibold text-gray-800">{linha.nome}</td>
                          <td className="p-4 text-center font-bold text-green-600">{linha.parcelasPagas} parcelas</td>
                          <td className="p-4 text-center font-bold text-yellow-600">{linha.parcelasPendentes} parcelas</td>
                          <td className={`p-4 text-right font-bold ${linha.valorPendente > 0 ? 'text-red-500' : 'text-green-600'}`}>
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
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center flex flex-col items-center justify-center h-full min-h-75">
              <FileSpreadsheet className="w-10 h-10 text-gray-400 mb-3 animate-pulse" />
              <h4 className="font-bold text-gray-700">Prévia de Dados</h4>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
import { Users, Check, Info, AlertCircle, CheckSquare, Square, Trash2 } from "lucide-react";
import { UseGerenciarChamada } from "../../hooks/UseGerenciarChamada";
import { ConfirmModal } from "../../components/ConfirmModal";

export function GerenciarChamada() {
  const {
    turmas,
    alunos,
    turmaSelecionada,
    setTurmaSelecionada,
    dataAula,
    setDataAula,
    loadingTurmas,
    loadingAlunos,
    salvando,
    erro,
    sucesso,
    isConfirmSalvarOpen,
    setIsConfirmSalvarOpen,
    isConfirmDeletarOpen,
    setIsConfirmDeletarOpen,
    temChamadaSalvaNoDia,
    handleAlternarPresenca,
    handleMarcarTodos,
    handleDesmarcarTodos,
    handleSalvarChamada,
    executarSalvarChamada,
    executarDeletarChamada
  } = UseGerenciarChamada();

  function formatarDataCabecalho(dataStr: string) {
    if (!dataStr) return "";
    return new Date(dataStr + 'T00:00:00').toLocaleDateString('pt-BR');
  }

  if (loadingTurmas) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-slate-400 font-medium animate-pulse">Carregando diários de chamada...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in-up relative text-slate-800 dark:text-slate-100">
      
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 pb-4">
        <Users className="w-6 h-6 text-sys-blue" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Gerenciar Chamada (Frequência)</h2>
      </div>

      {/*Seleção de Turma e Data*/}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="select-turma" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 items-center gap-1.5">
            Selecione a Turma
          </label>
          <select 
            id="select-turma"
            value={turmaSelecionada}
            onChange={e => setTurmaSelecionada(e.target.value)}
            className="w-full p-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 cursor-pointer font-medium"
          >
            <option value="">Selecione uma turma para carregar os alunos...</option>
            {turmas.map(t => (
              <option key={t.idTurma} value={t.idTurma}>Turma {t.idTurma}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="data-aula" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 items-center gap-1.5">
            Data da Aula
          </label>
          <input 
            id="data-aula"
            type="date"
            value={dataAula}
            onChange={e => setDataAula(e.target.value)}
            disabled={salvando}
            className="w-full p-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 font-medium"
          />
        </div>
      </div>

      {/*Lista de Alunos*/}
      {turmaSelecionada && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          
          <div className="p-4 bg-gray-50/50 dark:bg-slate-800/60 border-b border-gray-100 dark:border-slate-800 flex flex-wrap justify-between items-center gap-4">
            <h4 className="font-bold text-gray-700 dark:text-slate-100">Lista de Alunos</h4>
            
            {alunos.length > 0 && !loadingAlunos && (
              <div className="flex gap-2">
                <button 
                  onClick={handleMarcarTodos}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-sys-blue dark:text-blue-400 border border-blue-200 dark:border-blue-900 text-xs font-bold rounded-lg transition-all cursor-pointer"
                >
                  Marcar Todos Presentes
                </button>
                <button 
                  onClick={handleDesmarcarTodos}
                  className="px-3 py-1.5 bg-red-50 dark:bg-red-950/60 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-900 text-xs font-bold rounded-lg transition-all cursor-pointer"
                >
                  Marcar Todos Faltas
                </button>
              </div>
            )}
          </div>

          {erro && (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 border-b border-red-150 dark:border-red-900 flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
            </div>
          )}
          {sucesso && (
            <div className="p-4 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-b border-green-150 dark:border-green-900 flex items-center gap-2 font-semibold">
              <Check className="w-4 h-4 shrink-0" /> {sucesso}
            </div>
          )}

          {loadingAlunos ? (
            <div className="p-8 text-center text-gray-500 dark:text-slate-400 font-medium animate-pulse">
              Carregando lista de alunos da chamada...
            </div>
          ) : alunos.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-slate-400 font-medium">
              <Info className="w-8 h-8 text-gray-300 dark:text-slate-600 mx-auto mb-2" />
              Nenhum aluno matriculado nesta turma ainda.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-slate-800 text-xs text-gray-600 dark:text-slate-300 uppercase bg-gray-50/20 dark:bg-slate-800/40">
                      <th className="p-4 font-semibold text-center w-20">Presença</th>
                      <th className="p-4 font-semibold">Nome do Aluno</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100 dark:divide-slate-800">
                    {alunos.map((aluno) => (
                      <tr 
                        key={aluno.idUsuario} 
                        onClick={() => handleAlternarPresenca(aluno.idUsuario)}
                        className="hover:bg-gray-50/30 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                      >
                        <td className="p-4 text-center">
                          <div className="flex justify-center">
                            {aluno.presente ? (
                              <CheckSquare className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0" />
                            ) : (
                              <Square className="w-6 h-6 text-red-400 shrink-0" />
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-gray-800 dark:text-slate-100 block">{aluno.nome}</span>
                          <span className="text-xs text-gray-400 dark:text-slate-400 font-medium mt-1 block">
                            ID do Estudante: {aluno.idUsuario} 
                            {aluno.idFrequencia && <span className="ml-2 text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-950/60 px-2 py-0.5 rounded text-[10px] uppercase border border-green-200 dark:border-green-800">Salvo no Banco</span>}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-gray-50/50 dark:bg-slate-800/60 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center flex-wrap gap-4">
                {temChamadaSalvaNoDia ? (
                  <button
                    onClick={() => setIsConfirmDeletarOpen(true)}
                    disabled={salvando}
                    className="flex items-center gap-2 border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Apagar Chamada deste Dia
                  </button>
                ) : (
                  <div className="hidden sm:block"></div>
                )}

                <button 
                  onClick={handleSalvarChamada}
                  disabled={salvando}
                  className="bg-sys-blue hover:bg-sys-blue-hover text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-100 dark:shadow-none cursor-pointer disabled:opacity-50"
                >
                  {salvando ? 'Salvando Chamada...' : 'Confirmar e Salvar Chamada'}
                </button>
              </div>
            </>
          )}

        </div>
      )}

      {/*Modal Salvar*/}
      <ConfirmModal
        isOpen={isConfirmSalvarOpen}
        onClose={() => setIsConfirmSalvarOpen(false)}
        onConfirm={executarSalvarChamada}
        title="Salvar Diário de Classe"
        description={`Deseja realmente salvar a chamada da turma selecionada para o dia ${formatarDataCabecalho(dataAula)}?`}
        type="info"
        isLoading={salvando}
      />

      {/*Modal Apagar*/}
      <ConfirmModal
        isOpen={isConfirmDeletarOpen}
        onClose={() => setIsConfirmDeletarOpen(false)}
        onConfirm={executarDeletarChamada}
        title="Apagar Chamada"
        description={`Atenção: Você tem certeza absoluta de que deseja apagar toda a presença registrada no dia ${formatarDataCabecalho(dataAula)}? Esta ação não pode ser desfeita.`}
        type="danger"
        isLoading={salvando}
      />
    </div>
  );
}
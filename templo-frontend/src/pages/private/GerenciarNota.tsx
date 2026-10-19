import { UseGerenciarNota } from "../../hooks/UseGerenciarNota";
import { formatarData } from "../../utils/formatters";
import { Plus, Edit, Trash2, Info, AlertCircle, Check, ArrowLeft, Star } from "lucide-react";

export function GerenciarNota() {
  const {
    turmas,
    alunos,
    turmaSelecionada,
    setTurmaSelecionada,
    alunoSelecionado,
    setAlunoSelecionado,
    notasFiltradasDoAluno,
    valor,
    setValor,
    tipo,
    setTipo,
    dataNota,
    setDataNota,
    loadingTurmas,
    loadingAlunos,
    salvando,
    erro,
    sucesso,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    abrirModalAdicionar,
    abrirModalEditar,
    abrirModalDeletar,
    executarAdicionarNota,
    executarEditarNota,
    executarDeletarNota
  } = UseGerenciarNota();

  if (loadingTurmas) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-slate-400 font-medium animate-pulse">Carregando diários de notas...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in-up relative text-slate-800 dark:text-slate-100">
      
      {/*Título*/}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 pb-4">
        <Star className="w-6 h-6 text-sys-blue" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Gerenciar Notas</h2>
      </div>

      {erro && !isAddModalOpen && !isEditModalOpen && !isDeleteModalOpen && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-xl border border-red-150 dark:border-red-900 flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
        </div>
      )}
      {sucesso && !isAddModalOpen && !isEditModalOpen && !isDeleteModalOpen && (
        <div className="p-4 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 rounded-xl border border-green-150 dark:border-green-900 flex items-center gap-2 font-semibold">
          <Check className="w-4 h-4 shrink-0" /> {sucesso}
        </div>
      )}

      {/*Seleção de Turma*/}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-slate-800">
        <label htmlFor="select-turma" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 items-center gap-1.5">
          Selecione a Turma
        </label>
        <select 
          id="select-turma"
          value={turmaSelecionada}
          onChange={e => setTurmaSelecionada(e.target.value)}
          className="w-full p-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 cursor-pointer font-medium"
        >
          <option value="">Selecione uma turma...</option>
          {turmas.map(t => (
            <option key={t.idTurma} value={t.idTurma}>Turma {t.idTurma}</option>
          ))}
        </select>
      </div>

      {/*Grid de Alunos e Notas*/}
      {turmaSelecionada && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/*Coluna Alunos*/}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-150 dark:border-slate-800 overflow-hidden md:col-span-1 h-fit">
            <div className="p-4 bg-gray-50/50 dark:bg-slate-800/60 border-b border-gray-100 dark:border-slate-800">
              <h4 className="font-bold text-gray-700 dark:text-slate-100 text-sm">Alunos da Turma</h4>
            </div>

            {loadingAlunos ? (
              <p className="p-4 text-center text-xs text-gray-500 dark:text-slate-400 animate-pulse">Carregando alunos...</p>
            ) : alunos.length === 0 ? (
              <p className="p-4 text-center text-xs text-gray-500 dark:text-slate-400">Nenhum aluno cadastrado.</p>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
                {alunos.map(aluno => (
                  <button
                    key={aluno.idUsuario}
                    onClick={() => { setAlunoSelecionado(aluno); }}
                    className={`w-full text-left p-3.5 text-sm transition-colors flex items-center justify-between cursor-pointer
                      ${alunoSelecionado?.idUsuario === aluno.idUsuario 
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-sys-blue font-semibold' 
                        : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50/50 dark:hover:bg-slate-800/40'
                      }
                    `}
                  >
                    <span className="truncate">{aluno.nome}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/*Coluna Notas*/}
          <div className="md:col-span-2 space-y-4">
            {alunoSelecionado ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-150 dark:border-slate-800 overflow-hidden">
                
                <div className="p-4 bg-gray-50/50 dark:bg-slate-800/60 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-slate-100 text-sm">{alunoSelecionado.nome}</h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Histórico de avaliações lançadas</p>
                  </div>
                  
                  <button
                    onClick={abrirModalAdicionar}
                    className="bg-sys-blue hover:bg-sys-blue-hover text-white text-xs font-bold px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-100 dark:shadow-none"
                  >
                    <Plus className="w-3.5 h-3.5" /> Lançar Nota
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-150 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400 uppercase bg-gray-50/20 dark:bg-slate-800/40">
                        <th className="p-3 font-semibold">Avaliação</th>
                        <th className="p-3 font-semibold">Data</th>
                        <th className="p-3 font-semibold">Nota</th>
                        <th className="p-3 font-semibold text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-slate-800">
                      {notasFiltradasDoAluno.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-gray-500 dark:text-slate-400 font-medium">
                            <Info className="w-6 h-6 text-gray-300 dark:text-slate-600 mx-auto mb-1" />
                            Nenhuma nota lançada para este aluno ainda.
                          </td>
                        </tr>
                      ) : (
                        notasFiltradasDoAluno.map(nota => (
                          <tr key={nota.idNota} className="hover:bg-gray-50/20 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="p-3 font-semibold text-gray-800 dark:text-slate-100">{nota.tipo}</td>
                            <td className="p-3 text-gray-600 dark:text-slate-300">{formatarData(nota.data)}</td>
                            <td className={`p-3 font-bold text-base ${nota.valor >= 7.0 ? 'text-sys-blue' : 'text-red-500'}`}>
                              {nota.valor.toFixed(1)}
                            </td>
                            <td className="p-3 text-right space-x-1 whitespace-nowrap">
                              <button 
                                onClick={() => abrirModalEditar(nota)}
                                className="text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 p-1.5 rounded cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => abrirModalDeletar(nota)}
                                className="text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 p-1.5 rounded cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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
                <ArrowLeft className="w-10 h-10 text-gray-400 dark:text-slate-600 mb-3 animate-pulse" />
                <h4 className="font-bold text-gray-700 dark:text-slate-200">Visualizar Notas</h4>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">Selecione um aluno na coluna da esquerda para gerenciar as notas dele.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/*Modal Adicionar*/}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-slate-800 animate-modal-enter text-sm">
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
              <Plus className="w-5 h-5 text-sys-blue" /> Lançar Nota para {alunoSelecionado?.nome}
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-lg border border-red-150 dark:border-red-900 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); executarAdicionarNota(); }} className="space-y-4">
              <div>
                <label htmlFor="tipo-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Tipo de Avaliação *</label>
                <input 
                  id="tipo-add"
                  type="text" 
                  value={tipo}
                  onChange={e => setTipo(e.target.value)}
                  placeholder="Ex: PROVA 1, TRABALHO, RECUPERAÇÃO"
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="valor-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Nota (0.0 a 10.0) *</label>
                  <input 
                    id="valor-add"
                    type="number" 
                    step="0.1"
                    min="0"
                    max="10"
                    value={valor}
                    onChange={e => setValor(e.target.value)}
                    placeholder="0.0"
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="data-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Data da Prova *</label>
                  <input 
                    id="data-add"
                    type="date" 
                    value={dataNota}
                    onChange={e => setDataNota(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer">Cancelar</button>
                <button type="submit" disabled={salvando} className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer disabled:opacity-50">
                  {salvando ? 'Salvando...' : 'Lançar Nota'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*Modal Editar*/}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-slate-800 animate-modal-enter text-sm">
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
              <Edit className="w-5 h-5 text-sys-blue" /> Editar Nota de {alunoSelecionado?.nome}
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-lg border border-red-150 dark:border-red-900 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); executarEditarNota(); }} className="space-y-4">
              <div>
                <label htmlFor="tipo-edit" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Tipo de Avaliação *</label>
                <input 
                  id="tipo-edit"
                  type="text" 
                  value={tipo}
                  onChange={e => setTipo(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="valor-edit" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Nota (0.0 a 10.0) *</label>
                  <input 
                    id="valor-edit"
                    type="number" 
                    step="0.1"
                    min="0"
                    max="10"
                    value={valor}
                    onChange={e => setValor(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="data-edit" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Data da Prova *</label>
                  <input 
                    id="data-edit"
                    type="date" 
                    value={dataNota}
                    onChange={e => setDataNota(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer">Cancelar</button>
                <button type="submit" disabled={salvando} className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer disabled:opacity-50">
                  {salvando ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*Modal Deletar*/}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center border border-gray-150 dark:border-slate-800 animate-modal-enter text-sm">
            <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Excluir Registro de Nota</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
              Você tem certeza de que deseja apagar a avaliação de {alunoSelecionado?.nome}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={executarDeletarNota}
                disabled={salvando}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition cursor-pointer disabled:opacity-50"
              >
                {salvando ? 'Excluindo...' : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
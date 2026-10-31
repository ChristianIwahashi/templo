import { UseGerenciarTurmas, type TurmaCompleta } from "../../hooks/UseGerenciarTurmas";
import { ConfirmModal } from "../../components/ConfirmModal";
import { BookOpen, Plus, Search, Edit, Trash2, Users, UserPlus, Info, AlertCircle, Check, GraduationCap } from "lucide-react";

export function GerenciarTurmas() {
  const {
    turmasFiltradas,
    professores,
    alunosDisponiveis,
    nomeTurma,
    setNomeTurma,
    idProfessorSelecionado,
    setIdProfessorSelecionado,
    idAlunoSelecionado,
    setIdAlunoSelecionado,
    alunoSelecionadoObj,
    pesquisa,
    setPesquisa,
    turmaExpandidaId,
    setTurmaExpandidaId,
    loading,
    salvando,
    erro,
    sucesso,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isMatricularModalOpen,
    setIsMatricularModalOpen,
    isConfirmAddOpen,
    setIsConfirmAddOpen,
    isConfirmEditOpen,
    setIsConfirmEditOpen,
    isConfirmDeleteOpen,
    setIsConfirmDeleteOpen,
    isConfirmMatricularOpen,
    setIsConfirmMatricularOpen,
    turmaSelecionada,
    abrirModalCriar,
    abrirModalEditar,
    abrirModalMatricularAluno,
    prepararDeletar,
    prepararCriar,
    prepararEditar,
    prepararMatricular,
    executarCriarTurma,
    executarEditarTurma,
    executarMatricularAluno,
    executarDeletarTurma
  } = UseGerenciarTurmas();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-slate-400 font-medium animate-pulse">Carregando turmas da instituição...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in-up relative text-slate-800 dark:text-slate-100">
      
      {/* Cabeçalho */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-sys-blue" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Gerenciar Turmas</h2>
        </div>
        
        <button
          onClick={abrirModalCriar}
          className="bg-sys-blue hover:bg-sys-blue-hover text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-100 dark:shadow-none"
        >
          <Plus className="w-4 h-4" /> Nova Turma
        </button>
      </div>

      {/* Alertas */}
      {erro && !isAddModalOpen && !isEditModalOpen && !isMatricularModalOpen && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-xl border border-red-150 dark:border-red-900 flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
        </div>
      )}
      {sucesso && !isAddModalOpen && !isEditModalOpen && !isMatricularModalOpen && (
        <div className="p-4 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 rounded-xl border border-green-150 dark:border-green-900 flex items-center gap-2 font-semibold">
          <Check className="w-4 h-4 shrink-0" /> {sucesso}
        </div>
      )}

      {/* Busca */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex gap-4 items-center">
        <div className="w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input 
            type="text"
            value={pesquisa}
            onChange={e => setPesquisa(e.target.value)}
            placeholder="Buscar por nome, número da turma ou professor..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Tabela de Turmas */}
      {turmasFiltradas.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-gray-100 dark:border-slate-800 text-center text-gray-500 dark:text-slate-400 max-w-lg mx-auto">
          <Info className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="font-bold text-gray-700 dark:text-slate-200 text-lg">Nenhuma Turma Encontrada</p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Clique em "Nova Turma" para abrir uma sala de aula e atribuir um docente.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400 uppercase bg-gray-50/20 dark:bg-slate-800/40">
                  <th className="p-4 font-semibold">Identificação & Nível</th>
                  <th className="p-4 font-semibold">Professor Responsável</th>
                  <th className="p-4 font-semibold text-center">Alunos Matriculados</th>
                  <th className="p-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-slate-800">
                {turmasFiltradas.map((turma: TurmaCompleta) => {
                  const isExpanded = turmaExpandidaId === turma.idTurma;
                  const totalAlunos = turma.alunos?.length || 0;

                  return (
                    <>
                      <tr 
                        key={turma.idTurma} 
                        onClick={() => setTurmaExpandidaId(isExpanded ? null : turma.idTurma)}
                        className="hover:bg-gray-50/20 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                      >
                        {/* Identificação com Nome da Turma */}
                        <td className="p-4 font-bold text-gray-800 dark:text-slate-100 flex items-center gap-3">
                          <span className="p-2 bg-blue-50 dark:bg-blue-950/60 text-sys-blue rounded-lg shrink-0">
                            <GraduationCap className="w-5 h-5" />
                          </span>
                          <div>
                            <span className="block leading-tight text-sm font-bold text-gray-800 dark:text-slate-100">
                              {turma.nome || `Turma ${turma.idTurma}`}
                            </span>
                            <span className="text-[11px] font-normal text-gray-400 dark:text-slate-400 block mt-0.5 font-mono">
                              ID #{turma.idTurma}
                            </span>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="font-semibold text-gray-800 dark:text-slate-100 block">
                            {turma.professor?.usuario?.nome || 'Não atribuído'}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-slate-400">
                            {turma.professor?.usuario?.email || '-'}
                          </span>
                        </td>

                        <td className="p-4 text-center">
                          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-sys-blue border border-blue-150 dark:border-blue-900 rounded-full text-xs font-bold">
                            {totalAlunos} {totalAlunos === 1 ? 'aluno' : 'alunos'}
                          </span>
                        </td>

                        <td className="p-4 text-right space-x-1 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          <button 
                            onClick={() => abrirModalEditar(turma)}
                            className="text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 p-1.5 rounded cursor-pointer transition-colors" 
                            title="Editar Turma / Professor"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => prepararDeletar(turma)}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 p-1.5 rounded cursor-pointer transition-colors" 
                            title="Excluir Turma"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>

                      {/* Linha Expandível com Alunos */}
                      {isExpanded && (
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                          <td colSpan={4} className="p-5 border-b border-gray-150 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="font-bold text-gray-700 dark:text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-sys-blue" /> Alunos Matriculados em {turma.nome || `Turma ${turma.idTurma}`}:
                              </h5>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  abrirModalMatricularAluno(turma);
                                }}
                                className="text-xs bg-blue-50 dark:bg-blue-950/60 text-sys-blue dark:text-blue-400 border border-blue-200 dark:border-blue-900 hover:bg-sys-blue hover:text-white px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <UserPlus className="w-3.5 h-3.5" /> Vincular Aluno
                              </button>
                            </div>

                            {totalAlunos === 0 ? (
                              <p className="text-xs text-gray-400 dark:text-slate-400 italic">Nenhum aluno vinculado a esta turma no momento.</p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {turma.alunos?.map(a => (
                                  <div key={a.idUsuario} className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-gray-200 dark:border-slate-700 text-xs flex justify-between items-center shadow-xs">
                                    <span className="font-medium text-gray-800 dark:text-slate-200 truncate">{a.usuario.nome}</span>
                                    <span className="text-gray-400 dark:text-slate-400 font-mono text-[10px]">#{a.idUsuario}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal 1: Criar Turma */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-slate-800 animate-modal-enter text-sm">
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
              <Plus className="w-5 h-5 text-sys-blue" /> Abrir Nova Turma
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-lg border border-red-150 dark:border-red-900 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); prepararCriar(); }} className="space-y-4">
              {/* Campo de Nome da Turma */}
              <div>
                <label htmlFor="nome-turma-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">
                  Nome / Nível da Turma *
                </label>
                <input 
                  id="nome-turma-add"
                  type="text"
                  value={nomeTurma}
                  onChange={e => setNomeTurma(e.target.value)}
                  placeholder="Ex: Turma A - Livro 1 (Iniciante)"
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 font-medium"
                  required
                />
              </div>

              <div>
                <label htmlFor="prof-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">
                  Professor Responsável *
                </label>
                <select 
                  id="prof-add"
                  value={idProfessorSelecionado}
                  onChange={e => setIdProfessorSelecionado(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 cursor-pointer font-medium"
                  required
                >
                  <option value="">Selecione um professor da equipe...</option>
                  {professores.map(p => (
                    <option key={p.idUsuario} value={p.idUsuario}>{p.nome}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer">Prosseguir</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Editar Turma */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-slate-800 animate-modal-enter text-sm">
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
              <Edit className="w-5 h-5 text-sys-blue" /> Editar {turmaSelecionada?.nome || `Turma ${turmaSelecionada?.idTurma}`}
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-lg border border-red-150 dark:border-red-900 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); prepararEditar(); }} className="space-y-4">
              {/* Campo de Editar Nome da Turma */}
              <div>
                <label htmlFor="nome-turma-edit" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">
                  Nome / Nível da Turma *
                </label>
                <input 
                  id="nome-turma-edit"
                  type="text"
                  value={nomeTurma}
                  onChange={e => setNomeTurma(e.target.value)}
                  placeholder="Ex: Turma A - Livro 1 (Iniciante)"
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 font-medium"
                  required
                />
              </div>

              <div>
                <label htmlFor="prof-edit" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">
                  Professor Responsável *
                </label>
                <select 
                  id="prof-edit"
                  value={idProfessorSelecionado}
                  onChange={e => setIdProfessorSelecionado(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 cursor-pointer font-medium"
                  required
                >
                  <option value="">Selecione o novo docente...</option>
                  {professores.map(p => (
                    <option key={p.idUsuario} value={p.idUsuario}>{p.nome}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer">Prosseguir</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Matricular Aluno */}
      {isMatricularModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-slate-800 animate-modal-enter text-sm">
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
              <UserPlus className="w-5 h-5 text-sys-blue" /> Vincular Aluno à {turmaSelecionada?.nome || `Turma ${turmaSelecionada?.idTurma}`}
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-lg border border-red-150 dark:border-red-900 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); prepararMatricular(); }} className="space-y-4">
              <div>
                <label htmlFor="aluno-select" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">
                  Selecione o Estudante *
                </label>
                <select 
                  id="aluno-select"
                  value={idAlunoSelecionado}
                  onChange={e => setIdAlunoSelecionado(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 cursor-pointer font-medium"
                  required
                >
                  <option value="">Selecione um aluno ativo...</option>
                  {alunosDisponiveis.map(a => (
                    <option 
                      key={a.idUsuario} 
                      value={a.idUsuario}
                      disabled={a.idTurmaAtual === turmaSelecionada?.idTurma}
                    >
                      {a.nome} - {a.idTurmaAtual ? (a.idTurmaAtual === turmaSelecionada?.idTurma ? '(Já matriculado nesta turma)' : `(Turma ${a.idTurmaAtual})`) : '(Sem Turma)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsMatricularModalOpen(false)} className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer">Prosseguir</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modais de Confirmação Reutilizáveis */}
      <ConfirmModal 
        isOpen={isConfirmAddOpen}
        onClose={() => setIsConfirmAddOpen(false)}
        onConfirm={executarCriarTurma}
        title="Abrir Nova Turma"
        description={`Deseja confirmar a criação da turma "${nomeTurma}" atribuída ao docente selecionado?`}
        type="info"
        isLoading={salvando}
      />

      <ConfirmModal 
        isOpen={isConfirmEditOpen}
        onClose={() => setIsConfirmEditOpen(false)}
        onConfirm={executarEditarTurma}
        title="Salvar Alterações da Turma"
        description={`Deseja confirmar as alterações de nome/docente para a turma "${nomeTurma}"?`}
        type="info"
        isLoading={salvando}
      />

      <ConfirmModal 
        isOpen={isConfirmMatricularOpen}
        onClose={() => setIsConfirmMatricularOpen(false)}
        onConfirm={executarMatricularAluno}
        title="Confirmar Vinculação de Aluno"
        description={`Deseja matricular o aluno ${alunoSelecionadoObj?.nome} na turma "${turmaSelecionada?.nome || `Turma ${turmaSelecionada?.idTurma}`}"?`}
        type="info"
        isLoading={salvando}
      />

      <ConfirmModal 
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={executarDeletarTurma}
        title="Excluir Turma"
        description={`Atenção: Tem certeza de que deseja encerrar e excluir permanentemente a turma "${turmaSelecionada?.nome || `Turma ${turmaSelecionada?.idTurma}`}"? Todos os diários de presença e avisos associados serão apagados.`}
        type="danger"
        isLoading={salvando}
      />

    </div>
  );
}
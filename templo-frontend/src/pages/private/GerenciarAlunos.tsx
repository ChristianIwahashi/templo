import { UseGerenciarAlunos } from "../../hooks/UseGerenciarAlunos";
import { formatarData } from "../../utils/formatters";
import { padraoTelefone } from "../../utils/telefone";
import { ConfirmModal } from "../../components/ConfirmModal";
import { Users, UserPlus, Search, Edit, Trash2, Power, Info, AlertCircle, Check, Key } from "lucide-react";

export function GerenciarAlunos() {
  const {
    alunosFiltrados,
    turmas,
    nome,
    setNome,
    email,
    setEmail,
    senha,
    setSenha,
    telefone,
    setTelefone,
    dataNascimento,
    setDataNascimento,
    turmaSelecionada,
    setTurmaSelecionada,
    pesquisa,
    setPesquisa,
    ocultarInativos,
    setOcultarInativos,
    alunoExpandidoId,
    setAlunoExpandidoId,
    loading,
    salvando,
    erro,
    sucesso,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    alunoSelecionado,
    abrirModalMatricular,
    abrirModalEditar,
    abrirModalDeletar,
    executarMatricula,
    executarEditarAluno,
    executarDeletarAluno,
    alternarStatusAtivo
  } = UseGerenciarAlunos();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-slate-400 font-medium animate-pulse">Carregando diários da secretaria...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in-up relative text-slate-800 dark:text-slate-100">
      
      {/* Cabeçalho */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-sys-blue" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Gerenciar Alunos (Secretaria)</h2>
        </div>
        
        <button
          onClick={abrirModalMatricular}
          className="bg-sys-blue hover:bg-sys-blue-hover text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-100 dark:shadow-none"
        >
          <UserPlus className="w-4 h-4" /> Matricular Aluno
        </button>
      </div>

      {/* Alertas */}
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

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-150 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:grow relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input 
              id="busca-aluno"
              type="text"
              value={pesquisa}
              onChange={e => setPesquisa(e.target.value)}
              placeholder="Buscar aluno por nome, e-mail ou matrícula..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700 dark:text-slate-300 text-sm whitespace-nowrap shrink-0">
          <input 
            type="checkbox" 
            id="hide-inactive-aluno"
            checked={ocultarInativos}
            onChange={e => setOcultarInativos(e.target.checked)}
            className="w-4 h-4 rounded text-sys-blue focus:ring-sys-blue cursor-pointer"
          />
          <label htmlFor="hide-inactive-aluno" className="cursor-pointer">Ocultar Alunos Inativos</label>
        </div>
      </div>

      {/* Tabela de Alunos */}
      {alunosFiltrados.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-gray-150 dark:border-slate-800 text-center text-gray-500 dark:text-slate-400 max-w-lg mx-auto">
          <Info className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="font-bold text-gray-700 dark:text-slate-200 text-lg">Nenhum Aluno Encontrado</p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Clique em "Matricular Aluno" para realizar um cadastro.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-150 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-150 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400 uppercase bg-gray-50/20 dark:bg-slate-800/40">
                  <th className="p-4 font-semibold">Nome Completo / E-mail</th>
                  <th className="p-4 font-semibold">ID / Matrícula</th>
                  <th className="p-4 font-semibold">Turma</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-slate-800">
                {alunosFiltrados.map(aluno => {
                  const isExpanded = alunoExpandidoId === aluno.idUsuario;
                  return (
                    <>
                      <tr 
                        key={aluno.idUsuario} 
                        onClick={() => setAlunoExpandidoId(isExpanded ? null : aluno.idUsuario)}
                        className="hover:bg-gray-50/20 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                      >
                        <td className="p-4">
                          <span className="font-semibold text-gray-800 dark:text-slate-100 block leading-tight">{aluno.nome}</span>
                          <span className="text-xs text-gray-400 dark:text-slate-400 mt-1 block">{aluno.email}</span>
                        </td>
                        <td className="p-4 text-gray-600 dark:text-slate-300 font-medium">#{aluno.idUsuario}</td>
                        <td className="p-4 text-gray-600 dark:text-slate-300 font-medium">
                          {aluno.aluno?.idTurma ? `Turma ${aluno.aluno.idTurma}` : '-'}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                            aluno.ativo 
                              ? 'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' 
                              : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700'
                          }`}>
                            {aluno.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          <button 
                            onClick={() => abrirModalEditar(aluno)}
                            className="text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 p-1.5 rounded cursor-pointer transition-colors" 
                            title="Editar Informações"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => alternarStatusAtivo(aluno)}
                            className={`p-1.5 rounded cursor-pointer transition-colors ${
                              aluno.ativo 
                                ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-slate-800' 
                                : 'text-green-600 hover:bg-green-50 dark:hover:bg-slate-800'
                            }`}
                            title={aluno.ativo ? "Inativar Aluno" : "Ativar Aluno"}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => abrirModalDeletar(aluno)}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 p-1.5 rounded cursor-pointer transition-colors" 
                            title="Excluir Matrícula"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>

                      {/* Linha Expandível */}
                      {isExpanded && (
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                          <td colSpan={5} className="p-4 border-b border-gray-150 dark:border-slate-800">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                              <div>
                                <p className="text-gray-400 dark:text-slate-400 font-bold uppercase">Data de Nascimento</p>
                                <p className="font-semibold text-gray-700 dark:text-slate-200 mt-1">{aluno.aluno?.dataNascimento ? formatarData(aluno.aluno.dataNascimento) : '-'}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 dark:text-slate-400 font-bold uppercase">Telefone Cadastrado</p>
                                <p className="font-semibold text-gray-700 dark:text-slate-200 mt-1">{aluno.telefone}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 dark:text-slate-400 font-bold uppercase">Status de Matrícula</p>
                                <p className="font-semibold text-gray-700 dark:text-slate-200 mt-1">{aluno.ativo ? 'Regularizado' : 'Trancado/Inativo'}</p>
                              </div>
                            </div>
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

      {/* Modal 1: Matricular */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-slate-800 animate-modal-enter text-sm">
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
              <UserPlus className="w-5 h-5 text-sys-blue" /> Matricular Novo Estudante
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-lg border border-red-150 dark:border-red-900 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); executarMatricula(); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label htmlFor="nome-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Nome Completo *</label>
                  <input 
                    id="nome-add"
                    type="text" 
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    placeholder="Nome completo do aluno"
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">E-mail (Login) *</label>
                  <input 
                    id="email-add"
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="aluno@email.com"
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="telefone-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Telefone/Celular *</label>
                  <input 
                    id="telefone-add"
                    type="text" 
                    value={telefone}
                    onChange={e => setTelefone(padraoTelefone(e.target.value))}
                    placeholder="(00) 00000-0000"
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="nascimento-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Nascimento *</label>
                  <input 
                    id="nascimento-add"
                    type="date" 
                    value={dataNascimento}
                    onChange={e => setDataNascimento(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 font-medium"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="turma-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Vincular Turma</label>
                  <select 
                    id="turma-add"
                    value={turmaSelecionada}
                    onChange={e => setTurmaSelecionada(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 cursor-pointer font-medium"
                  >
                    <option value="">Nenhuma turma por enquanto</option>
                    {turmas.map(t => (
                      <option key={t.idTurma} value={t.idTurma}>Turma {t.idTurma}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label htmlFor="senha-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1 items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-sys-blue" /> Criar Senha Inicial *
                  </label>
                  <input 
                    id="senha-add"
                    type="password" 
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    placeholder="Mínimo 6 dígitos"
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer">Cancelar</button>
                <button type="submit" disabled={salvando} className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer disabled:opacity-50">
                  {salvando ? 'Matriculando...' : 'Concluir Matrícula'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Editar */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-slate-800 animate-modal-enter text-sm">
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
              <Edit className="w-5 h-5 text-sys-blue" /> Editar Cadastro de {alunoSelecionado?.nome}
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-lg border border-red-150 dark:border-red-900 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); executarEditarAluno(); }} className="space-y-4">
              <div>
                <label htmlFor="nome-edit" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Nome Completo *</label>
                <input 
                  id="nome-edit"
                  type="text" 
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label htmlFor="email-edit" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">E-mail (Login) *</label>
                <input 
                  id="email-edit"
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label htmlFor="tel-edit" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Telefone/Celular *</label>
                <input 
                  id="tel-edit"
                  type="text" 
                  value={telefone}
                  onChange={e => setTelefone(padraoTelefone(e.target.value))}
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label htmlFor="turma-edit" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Alterar Turma</label>
                <select 
                  id="turma-edit"
                  value={turmaSelecionada}
                  onChange={e => setTurmaSelecionada(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 cursor-pointer font-medium"
                >
                  <option value="">Nenhuma turma (Desvincular)</option>
                  {turmas.map(t => (
                    <option key={t.idTurma} value={t.idTurma}>Turma {t.idTurma}</option>
                  ))}
                </select>
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

      {/* Modal 3: Deletar Reutilizável */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executarDeletarAluno}
        title="Excluir Matrícula"
        description={`Atenção: Tem certeza de que deseja excluir permanentemente o cadastro de ${alunoSelecionado?.nome}? Todos os registros serão perdidos.`}
        type="danger"
        isLoading={salvando}
      />

    </div>
  );
}
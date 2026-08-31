import { UseGerenciarAlunos } from "../../hooks/UseGerenciarAlunos";
import { Users, UserPlus, Edit, Power, Info, AlertCircle, Check, Search, EyeOff, Eye, Trash2 } from "lucide-react";
import { padraoTelefone } from "../../utils/telefone";
import { useState } from "react";
import { ConfirmModal } from "../../components/ConfirmModal";
import { formatarData } from "../../utils/formatters";

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
    loading,
    salvando,
    erro,
    sucesso,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    alunoSelecionado,
    abrirModalMatricular,
    abrirModalEditar,
    executarMatricula,
    executarEditarAluno,
    ocultarInativos,
    setOcultarInativos,
    alunoExpandidoId,
    setAlunoExpandidoId,
    setIsConfirmAddOpen,
    isConfirmAddOpen,
    setIsConfirmEditOpen,
    isConfirmEditOpen,
    isConfirmDeleteOpen,
    setIsConfirmDeleteOpen,
    prepararMatricula,
    prepararEditarAluno,
    prepararAlternarStatus,
    setIsConfirmStatusOpen,
    isConfirmStatusOpen,
    executarAlternarStatusAtivo,
    prepararDeletarAluno,
    executarDeletarAluno
  } = UseGerenciarAlunos();

  const [showSenhaAdd, setShowSenhaAdd] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 font-medium animate-pulse">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in-up relative">

      {/*Título*/}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-sys-blue" />
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Alunos</h2>
        </div>

        <button
          onClick={abrirModalMatricular}
          className="bg-sys-blue hover:bg-sys-blue-hover text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-100"
        >
          <UserPlus className="w-4 h-4" /> Matricular Aluno
        </button>
      </div>

      {/*Alerta Global*/}
      {erro && !isAddModalOpen && !isEditModalOpen && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-150 flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
        </div>
      )}
      {sucesso && !isAddModalOpen && !isEditModalOpen && (
        <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-150 flex items-center gap-2 font-semibold">
          <Check className="w-4 h-4 shrink-0" /> {sucesso}
        </div>
      )}

      {/*Busca*/}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-end">
        <div className="w-full relative">
          <label htmlFor="busca-aluno" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 items-center gap-1.5">
            Buscar Aluno
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              id="busca-aluno"
              type="text"
              value={pesquisa}
              onChange={e => setPesquisa(e.target.value)}
              placeholder="Digite o nome, e-mail ou matrícula para buscar..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pb-3 shrink-0 cursor-pointer select-none">
          <input
            type="checkbox"
            id="ocultar-inativos"
            checked={ocultarInativos}
            onChange={e => setOcultarInativos(e.target.checked)}
            className="w-4 h-4 rounded text-sys-blue focus:ring-sys-blue cursor-pointer"
          />
          <label htmlFor="ocultar-inativos" className="text-sm font-semibold text-gray-600 cursor-pointer">
            Ocultar Inativos
          </label>
        </div>
      </div>

      {/*Tabela de Alunos*/}
      {alunosFiltrados.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-150 text-center text-gray-500 max-w-lg mx-auto">
          <Info className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-gray-700 text-lg">Nenhum Aluno Matriculado</p>
          <p className="text-xs text-gray-500 mt-1">Clique em "Matricular Aluno" para realizar a primeira inscrição de estudante no sistema.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase bg-gray-50/20">
                  <th className="p-4 font-semibold">Nome Completo / E-mail</th>
                  <th className="p-4 font-semibold">ID / Matrícula</th>
                  <th className="p-4 font-semibold">Turma</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {alunosFiltrados.map(aluno => {
                  const isExpanded = alunoExpandidoId === aluno.idUsuario;
                  return (
                    <>
                      <tr
                        key={aluno.idUsuario}
                        onClick={() => setAlunoExpandidoId(isExpanded ? null : aluno.idUsuario)}
                        className="border-b border-gray-100 hover:bg-gray-50/30 transition-colors cursor-pointer"
                      >
                        <td className="p-4">
                          <span className="font-semibold text-gray-800 block leading-tight">{aluno.nome}</span>
                          <span className="text-xs text-gray-400 mt-1 block">{aluno.email}</span>
                        </td>
                        <td className="p-4 text-gray-600 font-medium">#{aluno.idUsuario}</td>
                        <td className="p-4 text-gray-600 font-medium">
                          {aluno.aluno?.idTurma ? `Turma ${aluno.aluno.idTurma}` : '-'}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border
                            ${aluno.ativo
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-gray-50 text-gray-600 border-gray-200'
                            }
                          `}>
                            {aluno.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => abrirModalEditar(aluno)}
                            className="text-blue-500 hover:bg-blue-50 p-1.5 rounded cursor-pointer transition-colors"
                            title="Editar Informações"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => prepararAlternarStatus(aluno)}
                            className={`p-1.5 rounded cursor-pointer transition-colors
                              ${aluno.ativo
                                ? 'text-yellow-600 hover:bg-yellow-50'
                                : 'text-green-600 hover:bg-green-50'
                              }
                            `}
                            title={aluno.ativo ? "Inativar Aluno" : "Ativar Aluno"}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => prepararDeletarAluno(aluno)}
                            className="text-red-500 hover:bg-red-50 p-1.5 rounded cursor-pointer transition-colors"
                            title="Excluir Matrícula"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-slate-50/50">
                          <td colSpan={5} className="p-4 border-b border-gray-100">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                              <div>
                                <p className="text-gray-400 font-bold uppercase">Data de Nascimento</p>
                                <p className="font-semibold text-gray-700 mt-1">
                                  {aluno.aluno?.dataNascimento ? formatarData(aluno.aluno.dataNascimento) : '-'}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400 font-bold uppercase">Telefone Cadastrado</p>
                                <p className="font-semibold text-gray-700 mt-1">{padraoTelefone(aluno.telefone)}</p>
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

      {/*POST Aluno*/}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-gray-100 animate-modal-enter text-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-1.5">
              <UserPlus className="w-5 h-5 text-sys-blue" /> Matricular Novo Estudante
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg border border-red-150 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); prepararMatricula(); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label htmlFor="nome-add" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nome Completo *</label>
                  <input
                    id="nome-add"
                    type="text"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    placeholder="Nome completo do aluno"
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email-add" className="block text-xs font-semibold text-gray-500 uppercase mb-1">E-mail *</label>
                  <input
                    id="email-add"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="aluno@email.com"
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="telefone-add" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Telefone/Celular *</label>
                  <input
                    id="telefone-add"
                    type="text"
                    value={telefone}
                    onChange={e => setTelefone(padraoTelefone(e.target.value))}
                    placeholder="(00) 00000-0000"
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="nascimento-add" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nascimento *</label>
                  <input
                    id="nascimento-add"
                    type="date"
                    value={dataNascimento}
                    onChange={e => setDataNascimento(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 font-medium"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="turma-add" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Vincular Turma</label>
                  <select
                    id="turma-add"
                    value={turmaSelecionada}
                    onChange={e => setTurmaSelecionada(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 cursor-pointer font-medium"
                  >
                    <option value="">Nenhuma turma por enquanto</option>
                    {turmas.map(t => (
                      <option key={t.idTurma} value={t.idTurma}>Turma {t.idTurma}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label htmlFor="senha-add" className="block text-xs font-semibold text-gray-500 uppercase mb-1 items-center gap-1">
                    Criar Senha Inicial *
                  </label>
                  <div className="relative">
                    <input
                      id="senha-add"
                      type={showSenhaAdd ? "text" : "password"}
                      value={senha}
                      onChange={e => setSenha(e.target.value)}
                      placeholder="Mínimo 6 dígitos"
                      className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSenhaAdd(!showSenhaAdd)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-sys-blue cursor-pointer"
                      title={showSenhaAdd ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showSenhaAdd ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer">Cancelar</button>
                <button type="submit" disabled={salvando} className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer">
                  {salvando ? 'Matriculando...' : 'Matrícular'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*PUT Aluno*/}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 animate-modal-enter text-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-1.5">
              <Edit className="w-5 h-5 text-sys-blue" /> Editar Cadastro de {alunoSelecionado?.nome}
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg border border-red-150 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); prepararEditarAluno(); }} className="space-y-4">
              <div>
                <label htmlFor="nome-edit" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nome Completo *</label>
                <input
                  id="nome-edit"
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label htmlFor="email-edit" className="block text-xs font-semibold text-gray-500 uppercase mb-1">E-mail *</label>
                <input
                  id="email-edit"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label htmlFor="tel-edit" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Telefone/Celular *</label>
                <input
                  id="tel-edit"
                  type="text"
                  value={telefone}
                  onChange={e => setTelefone(padraoTelefone(e.target.value))}
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label htmlFor="turma-edit" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Alterar Turma</label>
                <select
                  id="turma-edit"
                  value={turmaSelecionada}
                  onChange={e => setTurmaSelecionada(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 cursor-pointer font-medium"
                >
                  <option value="">Nenhuma turma (Desvincular)</option>
                  {turmas.map(t => (
                    <option key={t.idTurma} value={t.idTurma}>Turma {t.idTurma}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer">Cancelar</button>
                <button type="submit" disabled={salvando} className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer">
                  {salvando ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*Confirmar POST*/}
      <ConfirmModal
        isOpen={isConfirmAddOpen}
        onClose={() => setIsConfirmAddOpen(false)}
        onConfirm={executarMatricula}
        title="Confirmar Matrícula"
        description={`Deseja confirmar a matrícula do aluno ${nome} no sistema? Uma conta associada será criada de forma automática.`}
        type="info"
        isLoading={salvando}
      />

      {/*Confirmar PUT*/}
      <ConfirmModal
        isOpen={isConfirmEditOpen}
        onClose={() => setIsConfirmEditOpen(false)}
        onConfirm={executarEditarAluno}
        title="Salvar Alterações"
        description={`Deseja confirmar as alterações de cadastro realizadas no aluno ${alunoSelecionado?.nome}?`}
        type="info"
        isLoading={salvando}
      />

      {/*Confirmar Status*/}
      <ConfirmModal
        isOpen={isConfirmStatusOpen}
        onClose={() => setIsConfirmStatusOpen(false)}
        onConfirm={executarAlternarStatusAtivo}
        title="Alterar Status"
        description={`Deseja alterar o status de acesso do aluno ${alunoSelecionado?.nome} para ${alunoSelecionado?.ativo ? 'INATIVO' : 'ATIVO'}?`}
        type="warning"
        isLoading={salvando}
      />

      {/*Confirmar DELETE*/}
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={executarDeletarAluno}
        title="Excluir Aluno"
        description={`Deseja realmente excluir permanentemente a matrícula do aluno ${alunoSelecionado?.nome}? Todos os registros de notas e frequências associados a ele serão apagados do sistema.`}
        type="danger"
        isLoading={salvando}
      />
    </div>
  );
}
import { UseGerenciarProfessores } from "../../hooks/UseGerenciarProfessores";
import { padraoTelefone } from "../../utils/telefone";
import { ConfirmModal } from "../../components/ConfirmModal";
import { UserCheck, UserPlus, Search, Edit, Trash2, Power, Info, AlertCircle, Check } from "lucide-react";

export function GerenciarProfessores() {
  const {
    professoresFiltrados,
    nome,
    setNome,
    email,
    setEmail,
    senha,
    setSenha,
    telefone,
    setTelefone,
    pesquisa,
    setPesquisa,
    ocultarInativos,
    setOcultarInativos,
    profExpandidoId,
    setProfExpandidoId,
    loading,
    salvando,
    erro,
    sucesso,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    professorSelecionado,
    isConfirmAddOpen,
    setIsConfirmAddOpen,
    isConfirmEditOpen,
    setIsConfirmEditOpen,
    isConfirmStatusOpen,
    setIsConfirmStatusOpen,
    isConfirmDeleteOpen,
    setIsConfirmDeleteOpen,
    abrirModalCadastrar,
    abrirModalEditar,
    prepararDeletar,
    prepararCadastrar,
    prepararEditar,
    prepararAlternarStatus,
    executarCadastro,
    executarEditarProfessor,
    executarAlternarStatusAtivo,
    executarDeletarProfessor
  } = UseGerenciarProfessores();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-slate-400 font-medium animate-pulse">Carregando diários do departamento de RH...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in-up relative text-slate-800 dark:text-slate-100">
      
      {/*Cabeçalho*/}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-sys-blue" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Gerenciar Professores</h2>
        </div>
        
        <button
          onClick={abrirModalCadastrar}
          className="bg-sys-blue hover:bg-sys-blue-hover text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-100 dark:shadow-none"
        >
          <UserPlus className="w-4 h-4" /> Cadastrar Professor
        </button>
      </div>

      {/*Alertas*/}
      {erro && !isAddModalOpen && !isEditModalOpen && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-xl border border-red-150 dark:border-red-900 flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
        </div>
      )}
      {sucesso && !isAddModalOpen && !isEditModalOpen && (
        <div className="p-4 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 rounded-xl border border-green-150 dark:border-green-900 flex items-center gap-2 font-semibold">
          <Check className="w-4 h-4 shrink-0" /> {sucesso}
        </div>
      )}

      {/*Filtros*/}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:grow relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input 
              type="text"
              value={pesquisa}
              onChange={e => setPesquisa(e.target.value)}
              placeholder="Buscar professor por nome, e-mail ou ID..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700 dark:text-slate-300 text-sm whitespace-nowrap shrink-0">
          <input 
            type="checkbox" 
            id="hide-inactive-docente"
            checked={ocultarInativos}
            onChange={e => setOcultarInativos(e.target.checked)}
            className="w-4 h-4 rounded text-sys-blue focus:ring-sys-blue cursor-pointer"
          />
          <label htmlFor="hide-inactive-docente" className="cursor-pointer">Ocultar Professores Inativos</label>
        </div>
      </div>

      {/*Tabela de Professores*/}
      {professoresFiltrados.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-gray-150 dark:border-slate-800 text-center text-gray-500 dark:text-slate-400 max-w-lg mx-auto">
          <Info className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="font-bold text-gray-700 dark:text-slate-200 text-lg">Nenhum Docente Cadastrado</p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Clique em "Cadastrar Professor" para adicionar membros à equipe.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400 uppercase bg-gray-50/20 dark:bg-slate-800/40">
                  <th className="p-4 font-semibold">Nome do Docente / E-mail</th>
                  <th className="p-4 font-semibold">ID / Cadastro</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-slate-800">
                {professoresFiltrados.map(prof => {
                  const isExpanded = profExpandidoId === prof.idUsuario;
                  return (
                    <>
                      <tr 
                        key={prof.idUsuario} 
                        onClick={() => setProfExpandidoId(isExpanded ? null : prof.idUsuario)}
                        className="hover:bg-gray-50/20 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                      >
                        <td className="p-4">
                          <span className="font-semibold text-gray-800 dark:text-slate-100 block leading-tight">{prof.nome}</span>
                          <span className="text-xs text-gray-400 dark:text-slate-400 mt-1 block">{prof.email}</span>
                        </td>
                        <td className="p-4 text-gray-600 dark:text-slate-300 font-medium">#{prof.idUsuario}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                            prof.ativo 
                              ? 'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' 
                              : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700'
                          }`}>
                            {prof.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          <button 
                            onClick={() => abrirModalEditar(prof)}
                            className="text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 p-1.5 rounded cursor-pointer transition-colors" 
                            title="Editar Cadastro"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => prepararAlternarStatus(prof)}
                            className={`p-1.5 rounded cursor-pointer transition-colors ${
                              prof.ativo 
                                ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-slate-800' 
                                : 'text-green-600 hover:bg-green-50 dark:hover:bg-slate-800'
                            }`}
                            title={prof.ativo ? "Inativar Professor" : "Ativar Professor"}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => prepararDeletar(prof)} 
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 p-1.5 rounded cursor-pointer transition-colors" 
                            title="Excluir Permanente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>

                      {/*Linha Expandível*/}
                      {isExpanded && (
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                          <td colSpan={4} className="p-4 border-b border-gray-150 dark:border-slate-800">
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <p className="text-gray-400 dark:text-slate-400 font-bold uppercase">Telefone de Contato</p>
                                <p className="font-semibold text-gray-700 dark:text-slate-200 mt-1">{prof.telefone}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 dark:text-slate-400 font-bold uppercase">Status de Contrato</p>
                                <p className="font-semibold text-gray-700 dark:text-slate-200 mt-1">{prof.ativo ? 'Docente em Atividade' : 'Contrato Suspenso/Desativado'}</p>
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

      {/*Modal Cadastrar*/}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-slate-800 animate-modal-enter text-sm">
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
              <UserPlus className="w-5 h-5 text-sys-blue" /> Cadastrar Novo Professor
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-lg border border-red-150 dark:border-red-900 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); prepararCadastrar(); }} className="space-y-4">
              <div>
                <label htmlFor="nome-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Nome Completo *</label>
                <input 
                  id="nome-add"
                  type="text" 
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Nome completo do docente"
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1 items-center gap-1">E-mail (Login) *</label>
                  <input 
                    id="email-add"
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="professor@email.com"
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="tel-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1 items-center gap-1">Celular *</label>
                  <input 
                    id="tel-add"
                    type="text" 
                    value={telefone}
                    onChange={e => setTelefone(padraoTelefone(e.target.value))}
                    placeholder="(00) 00000-0000"
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="senha-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1 items-center gap-1">
                  Criar Senha Inicial *
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

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer">Prosseguir</button>
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
              <Edit className="w-5 h-5 text-sys-blue" /> Editar Cadastro de {professorSelecionado?.nome}
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-lg border border-red-150 dark:border-red-900 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); prepararEditar(); }} className="space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
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
                  <label htmlFor="tel-edit" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Celular *</label>
                  <input 
                    id="tel-edit"
                    type="text" 
                    value={telefone}
                    onChange={e => setTelefone(padraoTelefone(e.target.value))}
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer">Prosseguir</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*Modais de Confirmação*/}
      <ConfirmModal 
        isOpen={isConfirmAddOpen}
        onClose={() => setIsConfirmAddOpen(false)}
        onConfirm={executarCadastro}
        title="Confirmar Cadastro de Docente"
        description={`Deseja confirmar o cadastro do professor ${nome} na equipe?`}
        type="info"
        isLoading={salvando}
      />

      <ConfirmModal 
        isOpen={isConfirmEditOpen}
        onClose={() => setIsConfirmEditOpen(false)}
        onConfirm={executarEditarProfessor}
        title="Salvar Alterações de Contrato"
        description={`Deseja salvar as alterações realizadas no cadastro de ${professorSelecionado?.nome}?`}
        type="info"
        isLoading={salvando}
      />
      <ConfirmModal 
        isOpen={isConfirmStatusOpen}
        onClose={() => setIsConfirmStatusOpen(false)}
        onConfirm={executarAlternarStatusAtivo}
        title="Alterar Status de Atividade"
        description={`Deseja alterar o status de contrato de ${professorSelecionado?.nome} para ${professorSelecionado?.ativo ? 'INATIVO' : 'ATIVO'}?`}
        type="warning"
        isLoading={salvando}
      />
      <ConfirmModal 
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={executarDeletarProfessor}
        title="Excluir Permanente"
        description={`Atenção: Tem certeza de que deseja excluir permanentemente o cadastro de ${professorSelecionado?.nome}? Esta ação é irreversível.`}
        type="danger"
        isLoading={salvando}
      />
    </div>
  );
}
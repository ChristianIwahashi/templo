import { UseGerenciarProfessores } from "../../hooks/UseGerenciarProfessores";
import { padraoTelefone } from "../../utils/telefone";
import { ConfirmModal } from "../../components/ConfirmModal";
import { useState } from "react";
import { UserCheck, UserPlus, Search, Edit, Trash2, Power, Info, AlertCircle, Check, Eye, EyeOff } from "lucide-react";

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
          <UserCheck className="w-6 h-6 text-sys-blue" />
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Professores</h2>
        </div>
        
        <button
          onClick={abrirModalCadastrar}
          className="bg-sys-blue hover:bg-sys-blue-hover text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-100"
        >
          <UserPlus className="w-4 h-4" /> Cadastrar Professor
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
          <label htmlFor="busca-professor" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 items-center gap-1.5">
            Buscar Professor
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              id="busca-professor"
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

      {/*Tabela de Professores*/}
      {professoresFiltrados.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-150 text-center text-gray-500 max-w-lg mx-auto">
          <Info className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-gray-700 text-lg">Nenhum Docente Cadastrado</p>
          <p className="text-xs text-gray-500 mt-1">Clique em "Cadastrar Professor" para adicionar o primeiro docente à equipe.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase bg-gray-50/20">
                  <th className="p-4 font-semibold">Nome do Docente / E-mail</th>
                  <th className="p-4 font-semibold">ID / Cadastro</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {professoresFiltrados.map(prof => {
                  const isExpanded = profExpandidoId === prof.idUsuario;
                  return (
                    <>
                      <tr 
                        key={prof.idUsuario} 
                        onClick={() => setProfExpandidoId(isExpanded ? null : prof.idUsuario)}
                        className="border-b border-gray-100 hover:bg-gray-50/30 transition-colors cursor-pointer"
                      >
                        <td className="p-4">
                          <span className="font-semibold text-gray-800 block leading-tight">{prof.nome}</span>
                          <span className="text-xs text-gray-400 mt-1 block">{prof.email}</span>
                        </td>
                        <td className="p-4 text-gray-600 font-medium">#{prof.idUsuario}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border
                            ${prof.ativo 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : 'bg-gray-50 text-gray-600 border-gray-200'
                            }
                          `}>
                            {prof.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          <button 
                            onClick={() => abrirModalEditar(prof)}
                            className="text-blue-500 hover:bg-blue-50 p-1.5 rounded cursor-pointer transition-colors" 
                            title="Editar Cadastro"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => prepararAlternarStatus(prof)}
                            className={`p-1.5 rounded cursor-pointer transition-colors
                              ${prof.ativo 
                                ? 'text-yellow-600 hover:bg-yellow-50' 
                                : 'text-green-600 hover:bg-green-50'
                              }
                            `}
                            title={prof.ativo ? "Inativar Professor" : "Ativar Professor"}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => prepararDeletar(prof)}
                            className="text-red-500 hover:bg-red-50 p-1.5 rounded cursor-pointer transition-colors" 
                            title="Excluir Permanente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>

                      {/*Detalhes*/}
                      {isExpanded && (
                        <tr className="bg-slate-50/50">
                          <td colSpan={4} className="p-4 border-b border-gray-100">
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <p className="text-gray-400 font-bold uppercase">Telefone de Contato</p>
                                <p className="font-semibold text-gray-700 mt-1">{prof.telefone}</p>
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

      {/*POST Professores*/}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 animate-modal-enter text-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-1.5">
              <UserPlus className="w-5 h-5 text-sys-blue" /> Cadastrar Novo Professor
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg border border-red-150 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); prepararCadastrar(); }} className="space-y-4">
              <div>
                <label htmlFor="nome-add" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nome Completo *</label>
                <input 
                  id="nome-add"
                  type="text" 
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Nome completo do docente"
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email-add" className="block text-xs font-semibold text-gray-500 uppercase mb-1 items-center gap-1"> E-mail (Login) *</label>
                  <input 
                    id="email-add"
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="professor@email.com"
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="tel-add" className="block text-xs font-semibold text-gray-500 uppercase mb-1 items-center gap-1"> Celular *</label>
                  <input 
                    id="tel-add"
                    type="text" 
                    value={telefone}
                    onChange={e => setTelefone(padraoTelefone(e.target.value))}
                    placeholder="(00) 00000-0000"
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                    required
                  />
                </div>
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

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer">Prosseguir</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*PUT Professor*/}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 animate-modal-enter text-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-1.5">
              <Edit className="w-5 h-5 text-sys-blue" /> Editar Cadastro de {professorSelecionado?.nome}
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg border border-red-150 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); prepararEditar(); }} className="space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email-edit" className="block text-xs font-semibold text-gray-500 uppercase mb-1">E-mail (Login) *</label>
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
                  <label htmlFor="tel-edit" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Celular *</label>
                  <input 
                    id="tel-edit"
                    type="text" 
                    value={telefone}
                    onChange={e => setTelefone(padraoTelefone(e.target.value))}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer">Prosseguir</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*Confirmar POST*/}
      <ConfirmModal 
        isOpen={isConfirmAddOpen}
        onClose={() => setIsConfirmAddOpen(false)}
        onConfirm={executarCadastro}
        title="Confirmar Cadastro de Docente"
        description={`Deseja confirmar o cadastro do professor ${nome} na equipe? Uma conta de acesso será criada de forma automática.`}
        type="info"
        isLoading={salvando}
      />

      {/*Confirmar PUT*/}
      <ConfirmModal 
        isOpen={isConfirmEditOpen}
        onClose={() => setIsConfirmEditOpen(false)}
        onConfirm={executarEditarProfessor}
        title="Salvar Alterações de Contrato"
        description={`Deseja salvar as alterações de dados cadastrais realizadas no professor ${professorSelecionado?.nome}?`}
        type="info"
        isLoading={salvando}
      />

      {/*Confirmar Status*/}
      <ConfirmModal 
        isOpen={isConfirmStatusOpen}
        onClose={() => setIsConfirmStatusOpen(false)}
        onConfirm={executarAlternarStatusAtivo}
        title="Alterar Status de Atividade"
        description={`Deseja alterar o status de contrato do professor ${professorSelecionado?.nome} para ${professorSelecionado?.ativo ? 'INATIVO' : 'ATIVO'}?`}
        type="warning"
        isLoading={salvando}
      />

      {/* Confirmar DELETE*/}
      <ConfirmModal 
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={executarDeletarProfessor}
        title="Excluir Permanente"
        description={`Você tem certeza de que deseja excluir permanentemente o cadastro e o contrato de ${professorSelecionado?.nome}? Todos os diários de classe, materiais postados e avaliações lançadas por eles serão apagados do sistema.`}
        type="danger"
        isLoading={salvando}
      />
    </div>
  );
}
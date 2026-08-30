import { UseGerenciarGestores } from "../../hooks/UseGerenciarGestores";
import { padraoTelefone } from "../../utils/telefone";
import { ConfirmModal } from "../../components/ConfirmModal";
import { Shield, UserPlus, Search, Edit, Trash2, Power, Info, AlertCircle, Check } from "lucide-react";

export function GerenciarGestores() {
    const {
        user,
        gestoresFiltrados,
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
        gestorExpandidoId,
        setGestorExpandidoId,
        loading,
        salvando,
        erro,
        sucesso,
        isAddModalOpen,
        setIsAddModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        gestorSelecionado,
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
        executarEditarGestor,
        executarAlternarStatusAtivo,
        executarDeletarGestor
    } = UseGerenciarGestores();

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
                    <Shield className="w-6 h-6 text-sys-blue" />
                    <h2 className="text-2xl font-bold text-gray-800">Gerenciar Gestores</h2>
                </div>

                <button
                    onClick={abrirModalCadastrar}
                    className="bg-sys-blue hover:bg-sys-blue-hover text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-100"
                >
                    <UserPlus className="w-4 h-4" /> Novo Gestor
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
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="w-full md:grow relative">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={pesquisa}
                            onChange={e => setPesquisa(e.target.value)}
                            placeholder="Buscar gestor por nome, e-mail ou ID..."
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700 text-sm whitespace-nowrap shrink-0">
                    <input
                        type="checkbox"
                        id="hide-inactive-gestor"
                        checked={ocultarInativos}
                        onChange={e => setOcultarInativos(e.target.checked)}
                        className="w-4 h-4 rounded text-sys-blue focus:ring-sys-blue cursor-pointer"
                    />
                    <label htmlFor="hide-inactive-gestor" className="cursor-pointer">Ocultar Inativos</label>
                </div>
            </div>

            {/*Tabela de Gestores*/}
            {gestoresFiltrados.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-gray-150 text-center text-gray-500 max-w-lg mx-auto">
                    <Info className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-bold text-gray-700 text-lg">Nenhum Gestor Encontrado</p>
                    <p className="text-xs text-gray-500 mt-1">Clique em "Novo Gestor" para registrar outro administrador no sistema.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase bg-gray-50/20">
                                    <th className="p-4 font-semibold">Nome / E-mail</th>
                                    <th className="p-4 font-semibold">ID</th>
                                    <th className="p-4 font-semibold text-center">Status</th>
                                    <th className="p-4 font-semibold text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {gestoresFiltrados.map(gestor => {
                                    const isExpanded = gestorExpandidoId === gestor.idUsuario;
                                    const isMe = user?.idUsuario === gestor.idUsuario;

                                    return (
                                        <>
                                            <tr
                                                key={gestor.idUsuario}
                                                onClick={() => setGestorExpandidoId(isExpanded ? null : gestor.idUsuario)}
                                                className="border-b border-gray-100 hover:bg-gray-50/30 transition-colors cursor-pointer"
                                            >
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-gray-800 leading-tight">{gestor.nome}</span>
                                                        {isMe && (
                                                            <span className="bg-blue-50 text-sys-blue border border-blue-200 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase">
                                                                Sua Conta
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-400 mt-1 block">{gestor.email}</span>
                                                </td>

                                                <td className="p-4 text-gray-600 font-medium">#{gestor.idUsuario}</td>

                                                <td className="p-4 text-center">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border
                            ${gestor.ativo
                                                            ? 'bg-green-50 text-green-700 border-green-200'
                                                            : 'bg-gray-50 text-gray-600 border-gray-200'
                                                        }
                          `}>
                                                        {gestor.ativo ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </td>

                                                <td className="p-4 text-right space-x-1 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => abrirModalEditar(gestor)}
                                                        className="text-blue-500 hover:bg-blue-50 p-1.5 rounded cursor-pointer transition-colors"
                                                        title="Editar Cadastro"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>

                                                    <button
                                                        onClick={() => prepararAlternarStatus(gestor)}
                                                        disabled={isMe}
                                                        className={`p-1.5 rounded transition-colors ${isMe
                                                                ? 'opacity-30 cursor-not-allowed text-gray-400'
                                                                : gestor.ativo
                                                                    ? 'text-yellow-600 hover:bg-yellow-50 cursor-pointer'
                                                                    : 'text-green-600 hover:bg-green-50 cursor-pointer'
                                                            }`}
                                                        title={isMe ? "Você não pode inativar sua própria conta" : gestor.ativo ? "Inativar" : "Ativar"}
                                                    >
                                                        <Power className="w-4 h-4" />
                                                    </button>

                                                    <button
                                                        onClick={() => prepararDeletar(gestor)}
                                                        disabled={isMe}
                                                        className={`p-1.5 rounded transition-colors ${isMe
                                                                ? 'opacity-30 cursor-not-allowed text-gray-400'
                                                                : 'text-red-500 hover:bg-red-50 cursor-pointer'
                                                            }`}
                                                        title={isMe ? "Você não pode excluir sua própria conta" : "Excluir Permanente"}
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
                                                                <p className="font-semibold text-gray-700 mt-1">{gestor.telefone || '-'}</p>
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

            {/*POST Gestor*/}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 animate-modal-enter text-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-1.5">
                            <UserPlus className="w-5 h-5 text-sys-blue" /> Novo Gestor
                        </h3>

                        {erro && (
                            <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg border border-red-150 flex items-center gap-2 font-semibold">
                                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
                            </div>
                        )}

                        <form onSubmit={e => { e.preventDefault(); prepararCadastrar(); }} className="space-y-4">
                            <div>
                                <label htmlFor="nome-add-gestor" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nome Completo *</label>
                                <input
                                    id="nome-add-gestor"
                                    type="text"
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                    placeholder="Nome do gestor"
                                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email-add-gestor" className="block text-xs font-semibold text-gray-500 uppercase mb-1 items-center gap-1"> E-mail *</label>
                                    <input
                                        id="email-add-gestor"
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="gestor@email.com"
                                        className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="tel-add-gestor" className="block text-xs font-semibold text-gray-500 uppercase mb-1 items-center gap-1"> Celular *</label>
                                    <input
                                        id="tel-add-gestor"
                                        type="text"
                                        value={telefone}
                                        onChange={e => setTelefone(padraoTelefone(e.target.value))}
                                        placeholder="(00) 00000-0000"
                                        className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="senha-add-gestor" className="block text-xs font-semibold text-gray-500 uppercase mb-1 items-center gap-1">
                                    Senha Inicial *
                                </label>
                                <input
                                    id="senha-add-gestor"
                                    type="password"
                                    value={senha}
                                    onChange={e => setSenha(e.target.value)}
                                    placeholder="Mínimo 6 dígitos"
                                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer">Prosseguir</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/*PUT Gestor*/}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 animate-modal-enter text-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-1.5">
                            <Edit className="w-5 h-5 text-sys-blue" /> Editar Cadastro de {gestorSelecionado?.nome}
                        </h3>

                        {erro && (
                            <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg border border-red-150 flex items-center gap-2 font-semibold">
                                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
                            </div>
                        )}

                        <form onSubmit={e => { e.preventDefault(); prepararEditar(); }} className="space-y-4">
                            <div>
                                <label htmlFor="nome-edit-gestor" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nome Completo *</label>
                                <input
                                    id="nome-edit-gestor"
                                    type="text"
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email-edit-gestor" className="block text-xs font-semibold text-gray-500 uppercase mb-1">E-mail *</label>
                                    <input
                                        id="email-edit-gestor"
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="tel-edit-gestor" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Celular *</label>
                                    <input
                                        id="tel-edit-gestor"
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

            {/*Cofirmar POST*/}
            <ConfirmModal
                isOpen={isConfirmAddOpen}
                onClose={() => setIsConfirmAddOpen(false)}
                onConfirm={executarCadastro}
                title="Confirmar Cadastro"
                description={`Deseja registrar ${nome} como novo gestor?`}
                type="info"
                isLoading={salvando}
            />

            {/*Cofirmar PUT*/}
            <ConfirmModal
                isOpen={isConfirmEditOpen}
                onClose={() => setIsConfirmEditOpen(false)}
                onConfirm={executarEditarGestor}
                title="Salvar Alterações"
                description={`Deseja atualizar os dados cadastrais do gestor ${gestorSelecionado?.nome}?`}
                type="info"
                isLoading={salvando}
            />

            {/*Cofirmar Status*/}
            <ConfirmModal
                isOpen={isConfirmStatusOpen}
                onClose={() => setIsConfirmStatusOpen(false)}
                onConfirm={executarAlternarStatusAtivo}
                title="Alterar Acesso"
                description={`Deseja mudar o status de acesso de ${gestorSelecionado?.nome} para ${gestorSelecionado?.ativo ? 'INATIVO' : 'ATIVO'}?`}
                type="warning"
                isLoading={salvando}
            />

            {/*Cofirmar DELETE*/}
            <ConfirmModal
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={executarDeletarGestor}
                title="Exclusão Permanente"
                description={`Atenção: Tem certeza de que deseja remover permanentemente o gestor ${gestorSelecionado?.nome}?`}
                type="danger"
                isLoading={salvando}
            />
        </div>
    );
}
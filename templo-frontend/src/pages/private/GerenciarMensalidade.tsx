import { UseGerenciarMensalidades, type MensalidadeAdmin } from "../../hooks/UseGerenciarMensalidade";
import { formatarDinheiro, formatarData, obterEstiloStatusPagamento } from "../../utils/formatters";
import { ConfirmModal } from "../../components/ConfirmModal";
import { DollarSign, Plus, Edit, Trash2, CheckCircle2, AlertCircle, Check, TrendingUp, AlertTriangle } from "lucide-react";

export function GerenciarMensalidade() {
  const {
    mensalidadesFiltradas,
    alunos,
    totalArrecadado,
    totalInadimplente,
    anosDisponiveis,
    pesquisa,
    setPesquisa,
    filtroStatus,
    setFiltroStatus,
    filtroAno,
    setFiltroAno,
    filtroOrdem,
    setFiltroOrdem,
    idAluno,
    setIdAluno,
    mes,
    setMes,
    valorReais,
    setValorReais,
    dataVencimento,
    setDataVencimento,
    statusPagamento,
    setStatusPagamento,
    loading,
    salvando,
    erro,
    sucesso,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isConfirmAddOpen,
    setIsConfirmAddOpen,
    isConfirmEditOpen,
    setIsConfirmEditOpen,
    isConfirmDeleteOpen,
    setIsConfirmDeleteOpen,
    isConfirmBaixaOpen,
    setIsConfirmBaixaOpen,
    mensalidadeSelecionada,
    alunoSelecionadoObj,
    abrirModalAdicionar,
    abrirModalEditar,
    prepararDeletar,
    prepararDarBaixa,
    prepararCriar,
    prepararEditar,
    executarCriarMensalidade,
    executarEditarMensalidade,
    executarDarBaixa,
    executarDeletarMensalidade
  } = UseGerenciarMensalidades();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-slate-400 font-medium animate-pulse">Carregando painel financeiro...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in-up relative text-slate-800 dark:text-slate-100">
      
      {/*Cabeçalho*/}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-sys-blue" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Gerenciar Mensalidades</h2>
        </div>
        
        <button
          onClick={abrirModalAdicionar}
          className="bg-sys-blue hover:bg-sys-blue-hover text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-100 dark:shadow-none"
        >
          <Plus className="w-4 h-4" /> Nova Cobrança
        </button>
      </div>

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

      {/*Cards de Resumo*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-slate-800 flex items-center justify-between border-l-4 border-l-green-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-xl">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Total Recebido</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mt-0.5">{formatarDinheiro(totalArrecadado)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-150 dark:border-slate-800 flex items-center justify-between border-l-4 border-l-yellow-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400 rounded-xl">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Inadimplência / Pendente</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mt-0.5">{formatarDinheiro(totalInadimplente)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/*Filtros*/}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-150 dark:border-slate-800 flex flex-wrap gap-4 items-end">
        <div className="w-full md:flex-1 min-w-55">
          <label htmlFor="busca-mensalidade" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 items-center gap-1.5">
            Buscar Aluno ou Mês
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            </div>
            <input 
              id="busca-mensalidade"
              type="text"
              value={pesquisa}
              onChange={e => setPesquisa(e.target.value)}
              placeholder="Digite o nome, mês ou ID..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex-1 min-w-40">
          <label htmlFor="status-admin" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Status
          </label>
          <select 
            id="status-admin"
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            className="w-full p-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 cursor-pointer"
          >
            <option value="todos">Todos os status</option>
            <option value="PENDENTE">Pendentes</option>
            <option value="PAGO">Pagos</option>
            <option value="ATRASADO">Atrasados</option>
            <option value="CANCELADO">Cancelados</option>
          </select>
        </div>

        <div className="flex-1 min-w-32.5">
          <label htmlFor="ano-admin" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Ano
          </label>
          <select 
            id="ano-admin"
            value={filtroAno}
            onChange={e => setFiltroAno(e.target.value)}
            className="w-full p-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 cursor-pointer"
          >
            <option value="todos">Todos os anos</option>
            {anosDisponiveis.map(ano => (
              <option key={ano} value={ano.toString()}>{ano}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-45">
          <label htmlFor="ordem-admin" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 items-center gap-1.5">
            Vencimento
          </label>
          <select 
            id="ordem-admin"
            value={filtroOrdem}
            onChange={e => setFiltroOrdem(e.target.value as 'desc' | 'asc')}
            className="w-full p-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 cursor-pointer"
          >
            <option value="desc">Mais recentes primeiro</option>
            <option value="asc">Mais antigas primeiro</option>
          </select>
        </div>
      </div>

      {/*Tabela de Mensalidades*/}
      {mensalidadesFiltradas.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-gray-150 dark:border-slate-800 text-center text-gray-500 dark:text-slate-400 max-w-lg mx-auto">
          <DollarSign className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="font-bold text-gray-700 dark:text-slate-200 text-lg">Nenhum Registro Financeiro</p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Nenhuma fatura encontrada. Clique em "Nova Cobrança" para registrar.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-150 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-150 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400 uppercase bg-gray-50/20 dark:bg-slate-800/40">
                  <th className="p-4 font-semibold">Aluno / Matrícula</th>
                  <th className="p-4 font-semibold">Mês de Ref.</th>
                  <th className="p-4 font-semibold">Vencimento</th>
                  <th className="p-4 font-semibold">Valor</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-slate-800">
                {mensalidadesFiltradas.map((m: MensalidadeAdmin) => (
                  <tr key={m.idMensalidade} className="hover:bg-gray-50/20 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-gray-800 dark:text-slate-100 block leading-tight">
                        {m.aluno?.usuario?.nome || 'Aluno Desconhecido'}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-slate-400">ID #{m.idAluno}</span>
                    </td>

                    <td className="p-4 font-medium text-gray-700 dark:text-slate-300">{m.mes}</td>
                    <td className="p-4 text-gray-600 dark:text-slate-300">{formatarData(m.dataVencimento)}</td>
                    <td className="p-4 font-bold text-gray-800 dark:text-slate-100">{formatarDinheiro(m.valor)}</td>

                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${obterEstiloStatusPagamento(m.statusPagamento)}`}>
                        {m.statusPagamento}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                      {m.statusPagamento !== 'PAGO' && (
                        <button
                          onClick={() => prepararDarBaixa(m)}
                          className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-slate-800 p-1.5 rounded cursor-pointer transition-colors inline-flex items-center gap-1"
                          title="Confirmar Pagamento (Dar Baixa)"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}

                      <button 
                        onClick={() => abrirModalEditar(m)}
                        className="text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 p-1.5 rounded cursor-pointer transition-colors" 
                        title="Editar Cobrança"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => prepararDeletar(m)}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 p-1.5 rounded cursor-pointer transition-colors" 
                        title="Excluir Registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/*Modal Adicionar*/}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-slate-800 animate-modal-enter text-sm">
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
              <Plus className="w-5 h-5 text-sys-blue" /> Registrar Nova Cobrança
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-lg border border-red-150 dark:border-red-900 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); prepararCriar(); }} className="space-y-4">
              <div>
                <label htmlFor="aluno-mens-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">
                  Aluno Pagador *
                </label>
                <select 
                  id="aluno-mens-add"
                  value={idAluno}
                  onChange={e => setIdAluno(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 cursor-pointer font-medium"
                  required
                >
                  <option value="">Selecione o estudante...</option>
                  {alunos.map(a => (
                    <option key={a.idUsuario} value={a.idUsuario}>{a.nome} (ID #{a.idUsuario})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="mes-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">
                    Mês de Ref. *
                  </label>
                  <input 
                    id="mes-add"
                    type="text" 
                    value={mes}
                    onChange={e => setMes(e.target.value)}
                    placeholder="Ex: Agosto/2026"
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="valor-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">
                    Valor (R$) *
                  </label>
                  <input 
                    id="valor-add"
                    type="text" 
                    value={valorReais}
                    onChange={e => setValorReais(e.target.value)}
                    placeholder="150.00"
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="venc-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">
                    Vencimento *
                  </label>
                  <input 
                    id="venc-add"
                    type="date" 
                    value={dataVencimento}
                    onChange={e => setDataVencimento(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 font-medium"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="status-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">
                    Status Inicial *
                  </label>
                  <select 
                    id="status-add"
                    value={statusPagamento}
                    onChange={e => setStatusPagamento(e.target.value as any)}
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 cursor-pointer font-medium"
                    required
                  >
                    <option value="PENDENTE">PENDENTE</option>
                    <option value="PAGO">PAGO</option>
                    <option value="ATRASADO">ATRASADO</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer"
                >
                  Prosseguir
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
              <Edit className="w-5 h-5 text-sys-blue" /> Editar Mensalidade de {mensalidadeSelecionada?.aluno.usuario.nome}
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-lg border border-red-150 dark:border-red-900 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); prepararEditar(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="mes-edit" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Mês de Ref. *</label>
                  <input 
                    id="mes-edit"
                    type="text" 
                    value={mes}
                    onChange={e => setMes(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="valor-edit" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Valor (R$) *</label>
                  <input 
                    id="valor-edit"
                    type="text" 
                    value={valorReais}
                    onChange={e => setValorReais(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="venc-edit" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Vencimento *</label>
                  <input 
                    id="venc-edit"
                    type="date" 
                    value={dataVencimento}
                    onChange={e => setDataVencimento(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 font-medium"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="status-edit" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Status Atual *</label>
                  <select 
                    id="status-edit"
                    value={statusPagamento}
                    onChange={e => setStatusPagamento(e.target.value as any)}
                    className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 cursor-pointer font-medium"
                    required
                  >
                    <option value="PENDENTE">PENDENTE</option>
                    <option value="PAGO">PAGO</option>
                    <option value="ATRASADO">ATRASADO</option>
                    <option value="CANCELADO">CANCELADO</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer"
                >
                  Prosseguir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*Modais de Confirmação*/}
      <ConfirmModal 
        isOpen={isConfirmAddOpen}
        onClose={() => setIsConfirmAddOpen(false)}
        onConfirm={executarCriarMensalidade}
        title="Registrar Cobrança"
        description={`Deseja emitir uma cobrança de ${mes} no valor de R$ ${valorReais} para o aluno ${alunoSelecionadoObj?.nome}?`}
        type="info"
        isLoading={salvando}
      />
      <ConfirmModal 
        isOpen={isConfirmEditOpen}
        onClose={() => setIsConfirmEditOpen(false)}
        onConfirm={executarEditarMensalidade}
        title="Salvar Alterações de Cobrança"
        description={`Deseja confirmar a alteração nos dados de faturamento de ${mensalidadeSelecionada?.aluno.usuario.nome}?`}
        type="info"
        isLoading={salvando}
      />
      <ConfirmModal 
        isOpen={isConfirmBaixaOpen}
        onClose={() => setIsConfirmBaixaOpen(false)}
        onConfirm={executarDarBaixa}
        title="Confirmar Recebimento"
        description={`Deseja dar baixa no pagamento da mensalidade de ${mensalidadeSelecionada?.mes} do aluno ${mensalidadeSelecionada?.aluno.usuario.nome} e alterar o status para PAGO?`}
        type="info"
        confirmText="Confirmar Pagamento"
        isLoading={salvando}
      />
      <ConfirmModal 
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={executarDeletarMensalidade}
        title="Excluir Registro de Mensalidade"
        description={`Atenção: Tem certeza de que deseja apagar permanentemente a mensalidade de ${mensalidadeSelecionada?.mes} do aluno ${mensalidadeSelecionada?.aluno.usuario.nome}?`}
        type="danger"
        isLoading={salvando}
      />
    </div>
  );
}
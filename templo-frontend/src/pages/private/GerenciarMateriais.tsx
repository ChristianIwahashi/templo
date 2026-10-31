import { UseGerenciarMateriais } from "../../hooks/UseGerenciarMateriais";
import { FolderOpen, Plus, Edit, Trash2, Info, AlertCircle, Check, CheckSquare, Square, FileText } from "lucide-react";
import { formatarData } from "../../utils/formatters";
import { InfoAuditoria } from "../../components/InfoAuditoria";
import { UploadInput } from "../../components/UploadInput";
import { ConfirmModal } from "../../components/ConfirmModal";

export function GerenciarMateriais() {
  const {
    turmas,
    materiais,
    alunosDaTurma,
    titulo,
    setTitulo,
    descricao,
    setDescricao,
    arquivoUrl,
    setArquivoUrl,
    turmaSelecionada,
    setTurmaSelecionada,
    isExclusivo,
    setIsExclusivo,
    alunosSelecionados,
    handleAlternarAlunoExclusivo,
    loading,
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
    materialSelecionado,
    abrirModalAdicionar,
    abrirModalEditar,
    abrirModalDeletar,
    executarAdicionarMaterial,
    executarEditarMaterial,
    executarDeletarMaterial,
  } = UseGerenciarMateriais();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 font-medium animate-pulse">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in-up relative text-slate-800 dark:text-slate-100">

      {/* Título */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-sys-blue" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Gerenciar Materiais Didáticos</h2>
        </div>

        <button
          onClick={abrirModalAdicionar}
          className="bg-sys-blue hover:bg-sys-blue-hover text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-100 dark:shadow-none"
        >
          <Plus className="w-4 h-4" /> Novo Material
        </button>
      </div>

      {/* Alertas Globais */}
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

      {/* Tabela de Materiais Postados */}
      {materiais.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-gray-150 dark:border-slate-800 text-center text-gray-500 dark:text-slate-400 max-w-lg mx-auto">
          <Info className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="font-bold text-gray-700 dark:text-slate-200 text-lg">Nenhum Material Encontrado</p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Você ainda não realizou o upload de nenhum material didático. Clique em "Novo Material" para começar.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-gray-500 dark:text-slate-400 uppercase bg-gray-50/50 dark:bg-slate-800/60 border-b border-gray-100 dark:border-slate-800">
                  <th className="p-4 font-semibold">Arquivo / Lição</th>
                  <th className="p-4 font-semibold">Destino</th>
                  <th className="p-4 font-semibold">Postado em</th>
                  <th className="p-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-slate-800">
                {materiais.map(material => (
                  <tr key={material.idMaterial} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors">

                    {/* Nome com Ícone */}
                    <td className="p-4 flex items-center gap-3">
                      <FileText className="text-red-500 w-6 h-6 shrink-0" />
                      <div>
                        <span className="font-semibold text-gray-800 dark:text-slate-100 block leading-tight">{material.titulo}</span>
                      </div>
                      {material.criadoPor && (
                        <InfoAuditoria
                          criadoPor={material.criadoPor}
                          atualizadoPor={material.atualizadoPor}
                        />
                      )}
                    </td>

                    {/* Destino (AQUI MOSTRA O NOME DA TURMA OU EXCLUSIVO) */}
                    <td className="p-4 text-gray-600 dark:text-slate-300">
                      {material.turmasVinculadas && material.turmasVinculadas.length > 0 ? (
                        <span className="bg-blue-50 dark:bg-blue-950/60 text-sys-blue dark:text-blue-400 border border-blue-150 dark:border-blue-900 text-xs px-2.5 py-1 rounded-full font-bold">
                          {material.turmasVinculadas[0].turma?.nome || `Turma ${material.turmasVinculadas[0].idTurma}`}
                        </span>
                      ) : (
                        <div className="flex flex-col gap-1 max-w-50">
                          <span className="bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-150 dark:border-purple-900 text-xs px-2.5 py-1 rounded-full font-bold self-start">
                            Exclusivo ({material.alunosVinculados?.length || 0} Alunos)
                          </span>
                          <span
                            className="text-xs text-gray-400 italic truncate"
                            title={material.alunosVinculados?.map(av => av.aluno.usuario.nome).join(', ')}
                          >
                            ({material.alunosVinculados?.map(av => av.aluno.usuario.nome).join(', ') || 'Nenhum'})
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-gray-600 dark:text-slate-300">
                      {material.dataPostagem ? formatarData(material.dataPostagem) : '-'}
                    </td>

                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => abrirModalEditar(material)}
                        className="text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 p-1.5 rounded cursor-pointer transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => abrirModalDeletar(material)}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 p-1.5 rounded cursor-pointer transition-colors"
                        title="Excluir"
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

      {/* Modal Adicionar Material (POST) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-slate-800 animate-modal-enter text-sm max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
              <Plus className="w-5 h-5 text-sys-blue" /> Publicar Novo Material Didático
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-lg border border-red-150 dark:border-red-900 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); executarAdicionarMaterial(); }} className="space-y-4">

              <div>
                <label htmlFor="titulo-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Título do Material *</label>
                <input
                  id="titulo-add"
                  type="text"
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  placeholder="Ex: Apostila de Caligrafia Hiragana"
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label htmlFor="desc-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Descrição *</label>
                <textarea
                  id="desc-add"
                  rows={2}
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
                  placeholder="Escreva uma descrição para os alunos..."
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                  required
                />
              </div>

              <UploadInput
                label="Upload da Apostila / Arquivo de Estudo *"
                accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx,.zip"
                value={arquivoUrl}
                onChange={setArquivoUrl}
              />

              {/* SELEÇÃO DA TURMA (AQUI EXIBE O NOME REAL DA TURMA) */}
              <div>
                <label htmlFor="select-turma-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Selecione a Turma *</label>
                <select
                  id="select-turma-add"
                  value={turmaSelecionada}
                  onChange={e => setTurmaSelecionada(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 cursor-pointer font-medium"
                  required
                >
                  <option value="">Selecione...</option>
                  {turmas.map(t => (
                    <option key={t.idTurma} value={t.idTurma}>
                      {t.nome ? `${t.nome} (ID #${t.idTurma})` : `Turma ${t.idTurma}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exclusividade */}
              {turmaSelecionada && (
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={isExclusivo}
                      onChange={e => setIsExclusivo(e.target.checked)}
                      className="w-4 h-4 rounded text-sys-blue focus:ring-sys-blue"
                    />
                    <span>Disponibilizar apenas para alunos específicos?</span>
                  </label>

                  {isExclusivo && (
                    <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-800/60 max-h-40 overflow-y-auto space-y-2">
                      <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-400 tracking-wider mb-2">Marque os alunos autorizados:</p>
                      {loadingAlunos ? (
                        <p className="text-xs text-gray-400 animate-pulse">Carregando...</p>
                      ) : alunosDaTurma.length === 0 ? (
                        <p className="text-xs text-gray-400">Nenhum aluno matriculado nesta turma.</p>
                      ) : (
                        alunosDaTurma.map(aluno => {
                          const isSelected = alunosSelecionados.includes(aluno.idUsuario);
                          return (
                            <div
                              key={aluno.idUsuario}
                              onClick={() => handleAlternarAlunoExclusivo(aluno.idUsuario)}
                              className="flex items-center gap-2.5 cursor-pointer text-xs p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
                              ) : (
                                <Square className="w-5 h-5 text-gray-400 shrink-0" />
                              )}
                              <span className="font-medium text-gray-700 dark:text-slate-200">{aluno.usuario.nome}</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer">Cancelar</button>
                <button type="submit" disabled={salvando} className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer disabled:opacity-50">
                  {salvando ? 'Publicando...' : 'Publicar Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Material (PUT) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-slate-800 animate-modal-enter text-sm">
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
              <Edit className="w-5 h-5 text-sys-blue" /> Editar Informações do Material
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-lg border border-red-150 dark:border-red-900 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); executarEditarMaterial(); }} className="space-y-4">
              <div>
                <label htmlFor="titulo-edit" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Título do Material *</label>
                <input
                  id="titulo-edit"
                  type="text"
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label htmlFor="desc-edit" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Descrição *</label>
                <textarea
                  id="desc-edit"
                  rows={2}
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                  required
                />
              </div>

              <UploadInput
                label="Substituir Arquivo / Apostila (Opcional)"
                accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx,.zip"
                value={arquivoUrl}
                onChange={setArquivoUrl}
              />

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

      {/* Modal Deletar (Reutilizando o ConfirmModal) */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executarDeletarMaterial}
        title="Excluir Material Didático"
        description={`Você tem certeza de que deseja apagar o material "${materialSelecionado?.titulo}"? Esta ação não pode ser desfeita.`}
        type="danger"
        isLoading={salvando}
      />
    </div>
  );
}
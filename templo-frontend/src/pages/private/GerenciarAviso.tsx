import { useState } from "react";
import { UseGerenciarAviso } from "../../hooks/UseGerenciarAviso";
import { formatarData } from "../../utils/formatters";
import { UploadInput } from "../../components/UploadInput";
import { ConfirmModal } from "../../components/ConfirmModal";
import { Megaphone, Plus, Edit, Trash2, Info, AlertCircle, Check, ZoomIn, X } from "lucide-react";

export function GerenciarAviso() {
  const {
    turmas,
    avisos,
    titulo,
    setTitulo,
    imagemUrl,
    setImagemUrl,
    turmaSelecionada,
    setTurmaSelecionada,
    loading,
    salvando,
    erro,
    sucesso,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isConfirmDeleteOpen,
    setIsConfirmDeleteOpen,
    abrirModalAdicionar,
    abrirModalEditar,
    prepararDeletar,
    executarAdicionarAviso,
    executarEditarAviso,
    executarDeletarAviso
  } = UseGerenciarAviso();

  const [imagemZoom, setImagemZoom] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-slate-400 font-medium animate-pulse">Carregando mural de avisos...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in-up relative text-slate-800 dark:text-slate-100">
      
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-sys-blue" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Gerenciar Avisos da Turma</h2>
        </div>
        
        <button
          onClick={abrirModalAdicionar}
          className="bg-sys-blue hover:bg-sys-blue-hover text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-100 dark:shadow-none"
        >
          <Plus className="w-4 h-4" /> Novo Aviso
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

      {avisos.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-gray-150 dark:border-slate-800 text-center text-gray-500 dark:text-slate-400 max-w-lg mx-auto">
          <Info className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="font-bold text-gray-700 dark:text-slate-200 text-lg">Mural Vazio</p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Você não publicou nenhum aviso de aula recentemente. Clique em "Novo Aviso" para começar.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {avisos.map(aviso => (
            <div key={aviso.idAvisoAula} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-md transition overflow-hidden">
              <div className="p-6 space-y-4 relative">
                
                <div className="absolute top-6 right-6 flex gap-1 z-10">
                  <button 
                    onClick={() => abrirModalEditar(aviso)}
                    className="text-gray-400 hover:text-sys-blue hover:bg-gray-50 dark:hover:bg-slate-800 p-1.5 rounded cursor-pointer transition-colors" 
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => prepararDeletar(aviso)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 p-1.5 rounded cursor-pointer transition-colors" 
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap justify-between items-start gap-2 border-b border-gray-100 dark:border-slate-800 pb-3 pr-20">
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-slate-100 text-lg leading-tight">{aviso.titulo}</h4>
                    <p className="text-xs text-sys-blue font-semibold mt-1.5 flex items-center gap-1">
                      Turma {aviso.idTurma}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-slate-400 font-medium">
                    {formatarData(aviso.dataPostagem)}
                  </span>
                </div>
                
                {aviso.imagemUrl && (
                  <div
                    onClick={() => setImagemZoom(aviso.imagemUrl || null)}
                    className="relative rounded-xl overflow-hidden h-64 sm:h-80 bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 flex items-center justify-center cursor-pointer group"
                    title="Clique para ver em tamanho cheio"
                  >
                    <img 
                      src={aviso.imagemUrl} 
                      alt="Anexo do aviso" 
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]" 
                    />

                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                      <span className="bg-black/50 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs">
                        <ZoomIn className="w-4 h-4" /> Clique para ampliar
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/*Modal Adicionar*/}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-slate-800 animate-modal-enter text-sm max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
              <Plus className="w-5 h-5 text-sys-blue" /> Novo Comunicado para a Turma
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-lg border border-red-150 dark:border-red-900 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); executarAdicionarAviso(); }} className="space-y-4">
              <div>
                <label htmlFor="turma-aviso-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Turma de Destino *</label>
                <select 
                  id="turma-aviso-add"
                  value={turmaSelecionada}
                  onChange={e => setTurmaSelecionada(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 cursor-pointer font-medium"
                  required
                >
                  <option value="">Selecione uma turma...</option>
                  {turmas.map(t => (
                    <option key={t.idTurma} value={t.idTurma}>Turma {t.idTurma}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="titulo-aviso-add" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Mensagem / Recado *</label>
                <textarea 
                  id="titulo-aviso-add"
                  rows={4}
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  placeholder="Escreva a mensagem que os alunos receberão..."
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                  required
                />
              </div>

              <UploadInput
                label="Foto / Cartaz do Aviso (Opcional)"
                accept="image/*"
                value={imagemUrl}
                onChange={setImagemUrl}
              />

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer">Cancelar</button>
                <button type="submit" disabled={salvando} className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer disabled:opacity-50">
                  {salvando ? 'Publicando...' : 'Publicar Aviso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*Modal Editar*/}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-slate-800 animate-modal-enter text-sm max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
              <Edit className="w-5 h-5 text-sys-blue" /> Editar Comunicado
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-lg border border-red-150 dark:border-red-900 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); executarEditarAviso(); }} className="space-y-4">
              <div>
                <label htmlFor="titulo-aviso-edit" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase mb-1">Mensagem / Recado *</label>
                <textarea 
                  id="titulo-aviso-edit"
                  rows={4}
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100"
                  required
                />
              </div>

              <UploadInput
                label="Substituir Foto / Cartaz (Opcional)"
                accept="image/*"
                value={imagemUrl}
                onChange={setImagemUrl}
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

      {/*Modal Deletar*/}
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={executarDeletarAviso}
        title="Excluir Comunicado"
        description="Você tem certeza de que deseja apagar este aviso do mural? Os alunos da turma não terão mais acesso a ele."
        type="danger"
        isLoading={salvando}
      />

      {/*Modal Lightbox*/}
      {imagemZoom && (
        <div 
          onClick={() => setImagemZoom(null)} 
          className="fixed inset-0 bg-black/85 z-300 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out animate-fade-in-up"
        >
          <button 
            onClick={() => setImagemZoom(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2.5 bg-black/50 rounded-full cursor-pointer transition-colors z-20 backdrop-blur-md"
            aria-label="Fechar zoom"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={imagemZoom} 
            alt="Aviso ampliado" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl animate-modal-enter cursor-default"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
}
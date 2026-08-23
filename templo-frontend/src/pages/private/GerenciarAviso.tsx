import { UseGerenciarAviso } from "../../hooks/UseGerenciarAviso";
import { formatarData } from "../../utils/formatters";
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
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    avisoSelecionado,
    abrirModalAdicionar,
    abrirModalEditar,
    abrirModalDeletar,
    executarAdicionarAviso,
    executarEditarAviso,
    executarDeletarAviso,
    imagemZoom,
    setImagemZoom
  } = UseGerenciarAviso();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 font-medium animate-pulse">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in-up relative">

      {/*Título*/}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-sys-blue" />
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Avisos da Turma</h2>
        </div>

        <button
          onClick={abrirModalAdicionar}
          className="bg-sys-blue hover:bg-sys-blue-hover text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-100"
        >
          <Plus className="w-4 h-4" /> Novo Aviso
        </button>
      </div>

      {/*Alerta Global*/}
      {erro && !isAddModalOpen && !isEditModalOpen && !isDeleteModalOpen && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-10 flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
        </div>
      )}
      {sucesso && !isAddModalOpen && !isEditModalOpen && !isDeleteModalOpen && (
        <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 flex items-center gap-2 font-semibold">
          <Check className="w-4 h-4 shrink-0" /> {sucesso}
        </div>
      )}

      {/*Mural de Avisos*/}
      {avisos.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-150 text-center text-gray-500 max-w-lg mx-auto">
          <Info className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-gray-700 text-lg">Mural Vazio</p>
          <p className="text-xs text-gray-500 mt-1">Você não publicou nenhum aviso de aula recentemente. Clique em "Novo Aviso" para começar.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {avisos.map(aviso => (
            <div key={aviso.idAvisoAula} className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition overflow-hidden">
              <div className="p-6 space-y-4 relative">

                {/*Botões de Ação Direita */}
                <div className="absolute top-6 right-6 flex gap-1 z-10">
                  <button
                    onClick={() => abrirModalEditar(aviso)}
                    className="text-gray-400 hover:text-sys-blue hover:bg-gray-50 p-1.5 rounded cursor-pointer transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => abrirModalDeletar(aviso)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded cursor-pointer transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/*Cabeçalho*/}
                <div className="flex flex-wrap justify-between items-start gap-2 pb-3 pr-20">
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg leading-tight">{aviso.titulo}</h4>
                    <p className="text-xs text-sys-blue font-semibold mt-1.5 flex items-center gap-1">
                      Enviado para a Turma {aviso.idTurma}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {formatarData(aviso.dataPostagem)}
                  </span>
                </div>

                {/*Imagem*/}
                {aviso.imagemUrl && (
                  <div
                    onClick={() => setImagemZoom(aviso.imagemUrl || null)}
                    className="relative rounded-xl overflow-hidden h-64 sm:h-80 bg-gray-50 border border-gray-100 flex items-center justify-center cursor-pointer group"
                    title="Clique para ver em tamanho cheio"
                  >
                    <img
                      src={aviso.imagemUrl}
                      alt="Anexo do aviso"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
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

      {/*Zoom*/}
      {imagemZoom && (
        <div
          onClick={() => setImagemZoom(null)}
          className="fixed inset-0 bg-black/80 z-300 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
        >
          <button
            onClick={() => setImagemZoom(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 bg-black/40 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={imagemZoom}
            alt="Aviso ampliado"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl animate-modal-enter cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/*POST aviso*/}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 animate-modal-enter text-sm">
            <h3 className="text-lg font-bold mb-4 pb-2 flex items-center gap-1.5">
              <Plus className="w-5 h-5 text-sys-blue" /> Escrever Novo Comunicado
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg border border-red-150 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); executarAdicionarAviso(); }} className="space-y-4">
              <div>
                <label htmlFor="select-turma-add" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Selecione a Turma *</label>
                <select
                  id="select-turma-add"
                  value={turmaSelecionada}
                  onChange={e => setTurmaSelecionada(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 cursor-pointer font-medium"
                  required
                >
                  <option value="">Selecione...</option>
                  {turmas.map(t => (
                    <option key={t.idTurma} value={t.idTurma}>Turma {t.idTurma}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="aviso-add" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Mensagem / Recado *</label>
                <textarea
                  id="aviso-add"
                  rows={4}
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  placeholder="Escreva a mensagem do comunicado..."
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label htmlFor="imagem-add" className="block text-xs font-semibold text-gray-500 uppercase mb-1 items-center gap-1.5">
                  URL de Imagem Anexa (Opcional)
                </label>
                <input
                  id="imagem-add"
                  type="text"
                  value={imagemUrl}
                  onChange={e => setImagemUrl(e.target.value)}
                  placeholder="https://site.com/imagem.png"
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer">Cancelar</button>
                <button type="submit" disabled={salvando} className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer">
                  {salvando ? 'Postando...' : 'Postar Aviso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*PUT aviso*/}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 animate-modal-enter text-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-1.5">
              <Edit className="w-5 h-5 text-sys-blue" /> Editar Comunicado da Turma {avisoSelecionado?.idTurma}
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg border border-red-150 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); executarEditarAviso(); }} className="space-y-4">
              <div>
                <label htmlFor="aviso-edit" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Mensagem / Recado *</label>
                <textarea
                  id="aviso-edit"
                  rows={4}
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label htmlFor="imagem-edit" className="block text-xs font-semibold text-gray-500 uppercase mb-1 items-center gap-1.5">
                  URL de Imagem Anexa (Opcional)
                </label>
                <input
                  id="imagem-edit"
                  type="text"
                  value={imagemUrl}
                  onChange={e => setImagemUrl(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                />
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

      {/*DELETE aviso*/}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center border border-gray-150 animate-modal-enter text-sm">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-red-600 mb-2">Excluir Comunicado</h3>
            <p className="text-sm text-gray-500 mb-6">
              Você tem certeza de que deseja APAGAR o aviso selecionado destinado à Turma {avisoSelecionado?.idTurma}? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={executarDeletarAviso}
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
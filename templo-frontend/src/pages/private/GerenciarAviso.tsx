import { UseGerenciarAviso } from "../../hooks/UseGerenciarAviso";
import { formatarData } from "../../utils/formatters";
import { UploadInput } from "../../components/UploadInput";
import { ConfirmModal } from "../../components/ConfirmModal";
import { Megaphone, Plus, Edit, Trash2, Calendar, Info, AlertCircle, Check } from "lucide-react";

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 font-medium animate-pulse">Carregando mural de avisos...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in-up relative">
      
      {/*Cabeçalho*/}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
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

      {/*Alertas Globais*/}
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

      {/*MURAL EM CARDS*/}
      {avisos.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-150 text-center text-gray-500 max-w-lg mx-auto">
          <Info className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-gray-700 text-lg">Mural Vazio</p>
          <p className="text-xs text-gray-500 mt-1">Você não publicou nenhum aviso de aula recentemente. Clique em "Novo Aviso" para começar.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {avisos.map(aviso => (
            <div key={aviso.idAvisoAula} className="bg-white rounded-2xl border border-gray-150 shadow-xs hover:shadow-md transition overflow-hidden">
              <div className="p-6 space-y-4 relative">
                
                {/*Ações Rápidas*/}
                <div className="absolute top-6 right-6 flex gap-1 z-10">
                  <button 
                    onClick={() => abrirModalEditar(aviso)}
                    className="text-gray-400 hover:text-sys-blue hover:bg-gray-50 p-1.5 rounded cursor-pointer transition-colors" 
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => prepararDeletar(aviso)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded cursor-pointer transition-colors" 
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/*Cabeçalho do Card*/}
                <div className="flex flex-wrap justify-between items-start gap-2 border-b border-gray-100 pb-3 pr-20">
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg leading-tight">{aviso.titulo}</h4>
                    <p className="text-xs text-sys-blue font-semibold mt-1.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Turma {aviso.idTurma}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {formatarData(aviso.dataPostagem)}
                  </span>
                </div>
                
                {/*Imagem do Aviso*/}
                {aviso.imagemUrl && (
                  <div className="relative rounded-xl overflow-hidden max-h-80 bg-gray-50 border border-gray-150 flex items-center justify-center">
                    <img src={aviso.imagemUrl} alt="Anexo do aviso" className="w-full h-full object-contain" />
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      )}

      {/*NOVO AVISO (POST)*/}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 animate-modal-enter text-sm max-h-[90vh] overflow-y-auto acc-scrollbar">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-1.5">
              <Plus className="w-5 h-5 text-sys-blue" /> Novo Comunicado para a Turma
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg border border-red-150 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); executarAdicionarAviso(); }} className="space-y-4">
              <div>
                <label htmlFor="turma-aviso-add" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Turma de Destino *</label>
                <select 
                  id="turma-aviso-add"
                  value={turmaSelecionada}
                  onChange={e => setTurmaSelecionada(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 cursor-pointer font-medium"
                  required
                >
                  <option value="">Selecione uma turma...</option>
                  {turmas.map(t => (
                    <option key={t.idTurma} value={t.idTurma}>Turma {t.idTurma}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="titulo-aviso-add" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Mensagem / Recado *</label>
                <textarea 
                  id="titulo-aviso-add"
                  rows={4}
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  placeholder="Escreva a mensagem que os alunos receberão..."
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                  required
                />
              </div>
              <UploadInput
                label="Foto / Cartaz do Aviso (Opcional)"
                accept="image/*"
                value={imagemUrl}
                onChange={setImagemUrl}
              />

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer">Cancelar</button>
                <button type="submit" disabled={salvando} className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer">
                  {salvando ? 'Publicando...' : 'Publicar Aviso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*EDITAR AVISO (PUT)*/}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 animate-modal-enter text-sm max-h-[90vh] overflow-y-auto acc-scrollbar">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-1.5">
              <Edit className="w-5 h-5 text-sys-blue" /> Editar Comunicado
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg border border-red-150 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); executarEditarAviso(); }} className="space-y-4">
              <div>
                <label htmlFor="titulo-aviso-edit" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Mensagem / Recado *</label>
                <textarea 
                  id="titulo-aviso-edit"
                  rows={4}
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                  required
                />
              </div>

              {/*COMPONENTE UPLOADINPUT INTEGRADO NA EDIÇÃO*/}
              <UploadInput
                label="Substituir Foto / Cartaz (Opcional)"
                accept="image/*"
                value={imagemUrl}
                onChange={setImagemUrl}
              />

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

      {/*MODAL DE CONFIRMAÇÃO REUTILIZÁVEL (ConfirmModal)*/}
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={executarDeletarAviso}
        title="Excluir Comunicado"
        description="Você tem certeza de que deseja apagar este aviso do mural? Os alunos da turma não terão mais acesso a ele."
        type="danger"
        isLoading={salvando}
      />
    </div>
  );
}
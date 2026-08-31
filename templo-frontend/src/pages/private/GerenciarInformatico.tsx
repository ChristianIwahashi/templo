import { UseGerenciarInformatico, type ConteudoItem, type EventoItem } from "../../hooks/UseGerenciarInformatico";
import { formatarData } from "../../utils/formatters";
import { ConfirmModal } from "../../components/ConfirmModal";
import { Globe, Plus, Edit, Trash2, Power, Info, AlertCircle, Check, Calendar, Layers } from "lucide-react";

export function GerenciarInformatico() {
  const {
    abaAtiva,
    setAbaAtiva,
    conteudos,
    eventos,
    categoria,
    setCategoria,
    tituloConteudo,
    setTituloConteudo,
    textoConteudo,
    setTextoConteudo,
    imagemUrlConteudo,
    setImagemUrlConteudo,
    tituloEvento,
    setTituloEvento,
    descricaoEvento,
    setDescricaoEvento,
    imagemUrlEvento,
    setImagemUrlEvento,
    ativoEvento,
    setAtivoEvento,
    loading,
    salvando,
    erro,
    sucesso,
    isAddConteudoOpen,
    setIsAddConteudoOpen,
    isEditConteudoOpen,
    setIsEditConteudoOpen,
    isAddEventoOpen,
    setIsAddEventoOpen,
    isEditEventoOpen,
    setIsEditEventoOpen,
    isConfirmAddConteudo,
    setIsConfirmAddConteudo,
    isConfirmEditConteudo,
    setIsConfirmEditConteudo,
    isConfirmDeleteConteudo,
    setIsConfirmDeleteConteudo,
    isConfirmAddEvento,
    setIsConfirmAddEvento,
    isConfirmEditEvento,
    setIsConfirmEditEvento,
    isConfirmDeleteEvento,
    setIsConfirmDeleteEvento,
    isConfirmStatusEvento,
    setIsConfirmStatusEvento,
    eventoSelecionado,
    abrirModalCriarConteudo,
    abrirModalEditarConteudo,
    prepararDeletarConteudo,
    prepararCriarConteudo,
    prepararEditarConteudo,
    executarCriarConteudo,
    executarEditarConteudo,
    executarDeletarConteudo,
    abrirModalCriarEvento,
    abrirModalEditarEvento,
    prepararDeletarEvento,
    prepararAlternarStatusEvento,
    prepararCriarEvento,
    prepararEditarEvento,
    executarCriarEvento,
    executarEditarEvento,
    executarAlternarStatusEvento,
    executarDeletarEvento
  } = UseGerenciarInformatico();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 font-medium animate-pulse">Carregando gerenciador do website...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in-up relative">
      
      {/* Cabeçalho */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6 text-sys-blue" />
          <h2 className="text-2xl font-bold text-gray-800">Gerenciador do Website</h2>
        </div>

        {abaAtiva === 'conteudos' ? (
          <button
            onClick={abrirModalCriarConteudo}
            className="bg-sys-blue hover:bg-sys-blue-hover text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-100"
          >
            <Plus className="w-4 h-4" /> Novo Conteúdo
          </button>
        ) : (
          <button
            onClick={abrirModalCriarEvento}
            className="bg-sys-blue hover:bg-sys-blue-hover text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-100"
          >
            <Plus className="w-4 h-4" /> Novo Evento
          </button>
        )}
      </div>

      {/* Alertas Globais */}
      {erro && !isAddConteudoOpen && !isEditConteudoOpen && !isAddEventoOpen && !isEditEventoOpen && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-150 flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
        </div>
      )}
      {sucesso && !isAddConteudoOpen && !isEditConteudoOpen && !isAddEventoOpen && !isEditEventoOpen && (
        <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-150 flex items-center gap-2 font-semibold">
          <Check className="w-4 h-4 shrink-0" /> {sucesso}
        </div>
      )}

      {/* Seletor de Abas Internas */}
      <div className="flex border-b border-gray-200 bg-white p-2 rounded-xl shadow-xs">
        <button
          onClick={() => setAbaAtiva('conteudos')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer
            ${abaAtiva === 'conteudos' 
              ? 'bg-blue-50 text-sys-blue' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
            }
          `}
        >
          <Layers className="w-4 h-4" />
          Páginas & Conteúdos ({conteudos.length})
        </button>
        <button
          onClick={() => setAbaAtiva('eventos')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer
            ${abaAtiva === 'eventos' 
              ? 'bg-blue-50 text-sys-blue' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
            }
          `}
        >
          <Calendar className="w-4 h-4" />
          Agenda de Eventos ({eventos.length})
        </button>
      </div>

      {/* =========================================================================
        ABA 1: CONTEÚDOS & PÁGINAS (História, Galeria, Sobre)
        ========================================================================= */}
      {abaAtiva === 'conteudos' && (
        conteudos.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-gray-150 text-center text-gray-500 max-w-lg mx-auto">
            <Info className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-bold text-gray-700 text-lg">Nenhum Conteúdo Cadastrado</p>
            <p className="text-xs text-gray-500 mt-1">Cadastre as seções de História, Galeria ou Cursos para alimentar a vitrine do site.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase bg-gray-50/20">
                    <th className="p-4 font-semibold">Seção / Categoria</th>
                    <th className="p-4 font-semibold">Título do Conteúdo</th>
                    <th className="p-4 font-semibold">Texto</th>
                    <th className="p-4 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {conteudos.map((item: ConteudoItem) => (
                    <tr key={item.idConteudo} className="border-b border-gray-100 hover:bg-gray-50/20 transition-colors">
                      <td className="p-4">
                        <span className="bg-blue-50 text-sys-blue border border-blue-150 text-xs px-2.5 py-1 rounded-full font-bold">
                          {item.categoria}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-gray-800">{item.titulo}</td>
                      <td className="p-4 text-gray-500 max-w-xs truncate" title={item.texto}>
                        {item.texto}
                      </td>
                      <td className="p-4 text-right space-x-1 whitespace-nowrap">
                        <button 
                          onClick={() => abrirModalEditarConteudo(item)}
                          className="text-blue-500 hover:bg-blue-50 p-1.5 rounded cursor-pointer transition-colors" 
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => prepararDeletarConteudo(item)}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded cursor-pointer transition-colors" 
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
        )
      )}

      {/* =========================================================================
        ABA 2: EVENTOS PÚBLICOS
        ========================================================================= */}
      {abaAtiva === 'eventos' && (
        eventos.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-gray-150 text-center text-gray-500 max-w-lg mx-auto">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-bold text-gray-700 text-lg">Nenhum Evento na Agenda</p>
            <p className="text-xs text-gray-500 mt-1">Publique eventos para que apareçam na página inicial e no mural aberto do templo.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase bg-gray-50/20">
                    <th className="p-4 font-semibold">Evento</th>
                    <th className="p-4 font-semibold">Data da Postagem</th>
                    <th className="p-4 font-semibold text-center">Visibilidade</th>
                    <th className="p-4 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {eventos.map((item: EventoItem) => (
                    <tr key={item.idAvisoEvento} className="border-b border-gray-100 hover:bg-gray-50/20 transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-gray-800 block leading-tight">{item.titulo}</span>
                        <span className="text-xs text-gray-400 max-w-xs truncate block mt-0.5">{item.descricao}</span>
                      </td>
                      <td className="p-4 text-gray-600 font-medium">{formatarData(item.dataPostagem)}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border
                          ${item.ativo 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-gray-50 text-gray-600 border-gray-200'
                          }
                        `}>
                          {item.ativo ? 'Visível no Site' : 'Oculto'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1 whitespace-nowrap">
                        <button 
                          onClick={() => abrirModalEditarEvento(item)}
                          className="text-blue-500 hover:bg-blue-50 p-1.5 rounded cursor-pointer transition-colors" 
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => prepararAlternarStatusEvento(item)}
                          className={`p-1.5 rounded cursor-pointer transition-colors
                            ${item.ativo 
                              ? 'text-yellow-600 hover:bg-yellow-50' 
                              : 'text-green-600 hover:bg-green-50'
                            }
                          `}
                          title={item.ativo ? "Ocultar do Site" : "Publicar no Site"}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => prepararDeletarEvento(item)}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded cursor-pointer transition-colors" 
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
        )
      )}

      {/* =========================================================================
        MODAIS: CONTEÚDO (POST / PATCH)
        ========================================================================= */}
      {(isAddConteudoOpen || isEditConteudoOpen) && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-gray-100 animate-modal-enter text-sm max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-1.5">
              <Layers className="w-5 h-5 text-sys-blue" />
              {isAddConteudoOpen ? 'Novo Conteúdo Institucional' : 'Editar Conteúdo'}
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg border border-red-150 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); isAddConteudoOpen ? prepararCriarConteudo() : prepararEditarConteudo(); }} className="space-y-4">
              <div>
                <label htmlFor="cat-conteudo" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Seção do Site *</label>
                <select 
                  id="cat-conteudo"
                  value={categoria}
                  onChange={e => setCategoria(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 cursor-pointer font-medium"
                  required
                >
                  <option value="HISTORIA">História do Templo</option>
                  <option value="SOBRE">Sobre Nós</option>
                  <option value="GALERIA">Galeria de Fotos</option>
                  <option value="AULAS">Aulas de Japonês (Estrutura)</option>
                </select>
              </div>

              <div>
                <label htmlFor="tit-conteudo" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Título *</label>
                <input 
                  id="tit-conteudo"
                  type="text" 
                  value={tituloConteudo}
                  onChange={e => setTituloConteudo(e.target.value)}
                  placeholder="Ex: Cerimônias e Filosofia Budista"
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label htmlFor="txt-conteudo" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Texto da Seção *</label>
                <textarea 
                  id="txt-conteudo"
                  rows={4}
                  value={textoConteudo}
                  onChange={e => setTextoConteudo(e.target.value)}
                  placeholder="Escreva o texto descritivo..."
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label htmlFor="url-conteudo" className="block text-xs font-semibold text-gray-500 uppercase mb-1 items-center gap-1">
                  URL da Foto / Mídia *
                </label>
                <input 
                  id="url-conteudo"
                  type="text" 
                  value={imagemUrlConteudo}
                  onChange={e => setImagemUrlConteudo(e.target.value)}
                  placeholder="https://link-da-imagem.com/foto.jpg"
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => { setIsAddConteudoOpen(false); setIsEditConteudoOpen(false); }} className="px-4 py-2 border rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer">Prosseguir</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
        MODAIS: EVENTO (POST / PATCH)
        ========================================================================= */}
      {(isAddEventoOpen || isEditEventoOpen) && (
        <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-gray-100 animate-modal-enter text-sm max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-1.5">
              <Calendar className="w-5 h-5 text-sys-blue" />
              {isAddEventoOpen ? 'Novo Evento na Agenda' : 'Editar Evento'}
            </h3>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg border border-red-150 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); isAddEventoOpen ? prepararCriarEvento() : prepararEditarEvento(); }} className="space-y-4">
              <div>
                <label htmlFor="tit-evento" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Título do Evento *</label>
                <input 
                  id="tit-evento"
                  type="text" 
                  value={tituloEvento}
                  onChange={e => setTituloEvento(e.target.value)}
                  placeholder="Ex: Hanamatsuri - Festival das Flores"
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label htmlFor="desc-evento" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Descrição / Programação *</label>
                <textarea 
                  id="desc-evento"
                  rows={3}
                  value={descricaoEvento}
                  onChange={e => setDescricaoEvento(e.target.value)}
                  placeholder="Descreva as atrações, horários e informações de entrada..."
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label htmlFor="img-evento" className="block text-xs font-semibold text-gray-500 uppercase mb-1 items-center gap-1">
                  URL da Foto do Cartaz (Opcional)
                </label>
                <input 
                  id="img-evento"
                  type="text" 
                  value={imagemUrlEvento}
                  onChange={e => setImagemUrlEvento(e.target.value)}
                  placeholder="https://link-do-cartaz.com/evento.jpg"
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="chk-ativo-evento"
                  checked={ativoEvento}
                  onChange={e => setAtivoEvento(e.target.checked)}
                  className="w-4 h-4 rounded text-sys-blue focus:ring-sys-blue"
                />
                <label htmlFor="chk-ativo-evento" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Publicar imediatamente na página inicial do site
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => { setIsAddEventoOpen(false); setIsEditEventoOpen(false); }} className="px-4 py-2 border rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl font-bold cursor-pointer">Prosseguir</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
        🛡️ MODAIS DE CONFIRMAÇÃO (ConfirmModal)
        ========================================================================= */}

      {/* Conteúdos */}
      <ConfirmModal 
        isOpen={isConfirmAddConteudo}
        onClose={() => setIsConfirmAddConteudo(false)}
        onConfirm={executarCriarConteudo}
        title="Publicar Conteúdo"
        description={`Deseja publicar este texto na seção ${categoria} do site institucional?`}
        type="info"
        isLoading={salvando}
      />

      <ConfirmModal 
        isOpen={isConfirmEditConteudo}
        onClose={() => setIsConfirmEditConteudo(false)}
        onConfirm={executarEditarConteudo}
        title="Salvar Alterações"
        description="Deseja confirmar a atualização deste conteúdo público?"
        type="info"
        isLoading={salvando}
      />

      <ConfirmModal 
        isOpen={isConfirmDeleteConteudo}
        onClose={() => setIsConfirmDeleteConteudo(false)}
        onConfirm={executarDeletarConteudo}
        title="Remover Conteúdo"
        description="Atenção: Tem certeza de que deseja apagar esta seção do site?"
        type="danger"
        isLoading={salvando}
      />

      {/* Eventos */}
      <ConfirmModal 
        isOpen={isConfirmAddEvento}
        onClose={() => setIsConfirmAddEvento(false)}
        onConfirm={executarCriarEvento}
        title="Agendar Evento"
        description={`Deseja adicionar o evento "${tituloEvento}" à agenda pública do templo?`}
        type="info"
        isLoading={salvando}
      />

      <ConfirmModal 
        isOpen={isConfirmEditEvento}
        onClose={() => setIsConfirmEditEvento(false)}
        onConfirm={executarEditarEvento}
        title="Atualizar Evento"
        description="Deseja salvar as alterações deste evento?"
        type="info"
        isLoading={salvando}
      />

      <ConfirmModal 
        isOpen={isConfirmStatusEvento}
        onClose={() => setIsConfirmStatusEvento(false)}
        onConfirm={executarAlternarStatusEvento}
        title="Alterar Visibilidade"
        description={`Deseja alterar a visibilidade deste evento para ${!eventoSelecionado?.ativo ? 'PÚBLICO' : 'OCULTO'}?`}
        type="warning"
        isLoading={salvando}
      />

      <ConfirmModal 
        isOpen={isConfirmDeleteEvento}
        onClose={() => setIsConfirmDeleteEvento(false)}
        onConfirm={executarDeletarEvento}
        title="Excluir Evento"
        description="Tem certeza de que deseja apagar permanentemente este evento da agenda?"
        type="danger"
        isLoading={salvando}
      />

    </div>
  );
}
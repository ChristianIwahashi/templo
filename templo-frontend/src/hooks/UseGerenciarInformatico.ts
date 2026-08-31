import { useEffect, useState } from "react";
import { UseAuth } from "./UseAuth";
import { Api } from "../api/Api";
import { AxiosError } from "axios";

export interface ConteudoItem {
  idConteudo: number;
  categoria: string;
  titulo: string;
  texto: string;
  imagemUrl: string;
  idGestor: number;
}
export interface EventoItem {
  idAvisoEvento: number;
  titulo: string;
  descricao: string;
  dataPostagem: string;
  imagemUrl?: string;
  ativo: boolean;
  idGestor: number;
}

export function UseGerenciarInformatico() {
  const { user } = UseAuth();
  const [abaAtiva, setAbaAtiva] = useState<'conteudos' | 'eventos'>('conteudos');
  const [conteudos, setConteudos] = useState<ConteudoItem[]>([]);
  const [eventos, setEventos] = useState<EventoItem[]>([]);
  const [categoria, setCategoria] = useState('HISTORIA');
  const [tituloConteudo, setTituloConteudo] = useState('');
  const [textoConteudo, setTextoConteudo] = useState('');
  const [imagemUrlConteudo, setImagemUrlConteudo] = useState('');
  const [conteudoSelecionado, setConteudoSelecionado] = useState<ConteudoItem | null>(null);
  const [tituloEvento, setTituloEvento] = useState('');
  const [descricaoEvento, setDescricaoEvento] = useState('');
  const [imagemUrlEvento, setImagemUrlEvento] = useState('');
  const [ativoEvento, setAtivoEvento] = useState(true);
  const [eventoSelecionado, setEventoSelecionado] = useState<EventoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [isAddConteudoOpen, setIsAddConteudoOpen] = useState(false);
  const [isEditConteudoOpen, setIsEditConteudoOpen] = useState(false);
  const [isAddEventoOpen, setIsAddEventoOpen] = useState(false);
  const [isEditEventoOpen, setIsEditEventoOpen] = useState(false);
  const [isConfirmAddConteudo, setIsConfirmAddConteudo] = useState(false);
  const [isConfirmEditConteudo, setIsConfirmEditConteudo] = useState(false);
  const [isConfirmDeleteConteudo, setIsConfirmDeleteConteudo] = useState(false);
  const [isConfirmAddEvento, setIsConfirmAddEvento] = useState(false);
  const [isConfirmEditEvento, setIsConfirmEditEvento] = useState(false);
  const [isConfirmDeleteEvento, setIsConfirmDeleteEvento] = useState(false);
  const [isConfirmStatusEvento, setIsConfirmStatusEvento] = useState(false);

  useEffect(() => {
    async function carregarDadosWebsite() {
      try {
        setLoading(true);
        const [conteudosRes, eventosRes] = await Promise.all([
          Api.get('/conteudo-informativo'),
          Api.get('/aviso-evento')
        ]);
        setConteudos(conteudosRes.data);
        setEventos(eventosRes.data);
      } catch (error) {
        console.error(error);
        setErro('Não foi possível carregar os dados do website.');
      } finally {
        setLoading(false);
      }
    }
    carregarDadosWebsite();
  }, []);

  async function atualizarConteudos() {
    try {
      const res = await Api.get('/conteudo-informativo');
      setConteudos(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  async function atualizarEventos() {
    try {
      const res = await Api.get('/aviso-evento');
      setEventos(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  //Modais de Conteudo
  function abrirModalCriarConteudo() {
    setCategoria('HISTORIA');
    setTituloConteudo('');
    setTextoConteudo('');
    setImagemUrlConteudo('');
    setErro('');
    setSucesso('');
    setIsAddConteudoOpen(true);
  }
  function abrirModalEditarConteudo(item: ConteudoItem) {
    setConteudoSelecionado(item);
    setCategoria(item.categoria);
    setTituloConteudo(item.titulo);
    setTextoConteudo(item.texto);
    setImagemUrlConteudo(item.imagemUrl);
    setErro('');
    setSucesso('');
    setIsEditConteudoOpen(true);
  }
  function prepararDeletarConteudo(item: ConteudoItem) {
    setConteudoSelecionado(item);
    setErro('');
    setSucesso('');
    setIsConfirmDeleteConteudo(true);
  }
  function prepararCriarConteudo() {
    if (!tituloConteudo.trim() || !textoConteudo.trim() || !imagemUrlConteudo.trim()) {
      setErro('Preencha todos os campos obrigatórios do conteúdo.');
      return;
    }
    setIsConfirmAddConteudo(true);
  }
  function prepararEditarConteudo() {
    if (!tituloConteudo.trim() || !textoConteudo.trim() || !imagemUrlConteudo.trim()) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }
    setIsConfirmEditConteudo(true);
  }

  //POST Conteudo
  async function executarCriarConteudo() {
    if (!user) return;
    setIsConfirmAddConteudo(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.post('/conteudo-informativo', {
        categoria,
        titulo: tituloConteudo,
        texto: textoConteudo,
        imagemUrl: imagemUrlConteudo,
        idGestor: user.idUsuario
      });

      setSucesso('Conteúdo publicado no site com sucesso!');
      await atualizarConteudos();
      setIsAddConteudoOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao publicar conteúdo.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  //PUT Conteudo
  async function executarEditarConteudo() {
    if (!conteudoSelecionado) return;
    setIsConfirmEditConteudo(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.patch(`/conteudo-informativo/${conteudoSelecionado.idConteudo}`, {
        categoria,
        titulo: tituloConteudo,
        texto: textoConteudo,
        imagemUrl: imagemUrlConteudo
      });

      setSucesso('Conteúdo atualizado com sucesso!');
      await atualizarConteudos();
      setIsEditConteudoOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao atualizar conteúdo.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  //DELETE Conteudo
  async function executarDeletarConteudo() {
    if (!conteudoSelecionado) return;
    setIsConfirmDeleteConteudo(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.delete(`/conteudo-informativo/${conteudoSelecionado.idConteudo}`);
      setSucesso('Conteúdo removido do site!');
      await atualizarConteudos();
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao remover conteúdo.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  //Modais Evento
  function abrirModalCriarEvento() {
    setTituloEvento('');
    setDescricaoEvento('');
    setImagemUrlEvento('');
    setAtivoEvento(true);
    setErro('');
    setSucesso('');
    setIsAddEventoOpen(true);
  }
  function abrirModalEditarEvento(item: EventoItem) {
    setEventoSelecionado(item);
    setTituloEvento(item.titulo);
    setDescricaoEvento(item.descricao);
    setImagemUrlEvento(item.imagemUrl || '');
    setAtivoEvento(item.ativo);
    setErro('');
    setSucesso('');
    setIsEditEventoOpen(true);
  }
  function prepararDeletarEvento(item: EventoItem) {
    setEventoSelecionado(item);
    setErro('');
    setSucesso('');
    setIsConfirmDeleteEvento(true);
  }
  function prepararAlternarStatusEvento(item: EventoItem) {
    setEventoSelecionado(item);
    setIsConfirmStatusEvento(true);
  }
  function prepararCriarEvento() {
    if (!tituloEvento.trim() || !descricaoEvento.trim()) {
      setErro('Preencha os campos obrigatórios do evento.');
      return;
    }
    setIsConfirmAddEvento(true);
  }
  function prepararEditarEvento() {
    if (!tituloEvento.trim() || !descricaoEvento.trim()) {
      setErro('Preencha os campos obrigatórios.');
      return;
    }
    setIsConfirmEditEvento(true);
  }

  //POST Evento
  async function executarCriarEvento() {
    if (!user) return;
    setIsConfirmAddEvento(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.post('/aviso-evento', {
        titulo: tituloEvento,
        descricao: descricaoEvento,
        imagemUrl: imagemUrlEvento || undefined,
        ativo: ativoEvento,
        idGestor: user.idUsuario
      });

      setSucesso('Evento publicado na agenda pública do site!');
      await atualizarEventos();
      setIsAddEventoOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao publicar evento.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  //PUT Evento
  async function executarEditarEvento() {
    if (!eventoSelecionado) return;
    setIsConfirmEditEvento(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.patch(`/aviso-evento/${eventoSelecionado.idAvisoEvento}`, {
        titulo: tituloEvento,
        descricao: descricaoEvento,
        imagemUrl: imagemUrlEvento || undefined,
        ativo: ativoEvento
      });

      setSucesso('Evento atualizado com sucesso!');
      await atualizarEventos();
      setIsEditEventoOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao atualizar evento.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  //Status Evento
  async function executarAlternarStatusEvento() {
    if (!eventoSelecionado) return;
    setIsConfirmStatusEvento(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.patch(`/aviso-evento/${eventoSelecionado.idAvisoEvento}`, {
        ativo: !eventoSelecionado.ativo
      });

      setSucesso(`Evento marcado como ${!eventoSelecionado.ativo ? 'ATIVO' : 'INATIVO'} no site.`);
      await atualizarEventos();
    } catch (error) {
      console.error(error);
      setErro('Não foi possível alterar a visibilidade do evento.');
    } finally {
      setSalvando(false);
    }
  }

  //DELETE Evento
  async function executarDeletarEvento() {
    if (!eventoSelecionado) return;
    setIsConfirmDeleteEvento(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.delete(`/aviso-evento/${eventoSelecionado.idAvisoEvento}`);
      setSucesso('Evento excluído da agenda!');
      await atualizarEventos();
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao excluir evento.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  return {
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
  };
}
import { useEffect, useState } from "react";
import { UseAuth } from "./UseAuth";
import { Api } from "../api/api";
import { AxiosError } from "axios";
import type { AutorAuditoria } from "../components/InfoAuditoria";

export interface Turma {
  idTurma: number;
  nome?: string;
  idProfessor?: number;
}

export interface AvisoAula {
  idAvisoAula: number;
  titulo: string;
  dataPostagem: string;
  imagemUrl?: string;
  idProfessor?: number | null;
  professor?: { usuario: { nome: string } } | null;
  turmasVinculadas?: { idTurma: number; turma?: { idTurma: number; nome?: string } }[];
  criadoEm?: string;
  atualizadoEm?: string;
  criadoPor?: AutorAuditoria | null;
  atualizadoPor?: AutorAuditoria | null;
  alunosVinculados?: { aluno: { usuario: { nome: string } } }[];
}

export function UseGerenciarAviso() {
  const { user } = UseAuth();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [avisos, setAvisos] = useState<AvisoAula[]>([]);
  const [titulo, setTitulo] = useState<string>('');
  const [imagemUrl, setImagemUrl] = useState<string>('');
  const [turmaSelecionada, setTurmaSelecionada] = useState<number[]>([]);
  const [enviarParaTodas, setEnviarParaTodas] = useState(false);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [avisoSelecionado, setAvisoSelecionado] = useState<AvisoAula | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  //Carrega turmas e avisos em paralelo
  useEffect(() => {
    async function carregarDadosMural() {
      try {
        setLoading(true);
        const [turmasRes, avisosRes] = await Promise.all([
          Api.get('/turma'),
          Api.get('/aviso-aula')
        ]);
        setTurmas(turmasRes.data);
        setAvisos(avisosRes.data);
      } catch (error) {
        console.error(error);
        setErro('Não foi possível carregar os avisos do mural.');
      } finally {
        setLoading(false);
      }
    }
    carregarDadosMural();
  }, []);

  async function atualizarMural() {
    try {
      const response = await Api.get('/aviso-aula');
      setAvisos(response.data);
    } catch (error) {
      console.error("Erro ao atualizar mural:", error);
    }
  }

  function abrirModalAdicionar() {
    setTitulo('');
    setImagemUrl('');
    setTurmaSelecionada([]);
    setEnviarParaTodas(false);
    setErro('');
    setSucesso('');
    setIsAddModalOpen(true);
  }

  function abrirModalEditar(aviso: AvisoAula) {
    setAvisoSelecionado(aviso);
    setTitulo(aviso.titulo);
    setImagemUrl(aviso.imagemUrl || '');
    setErro('');
    setSucesso('');
    setIsEditModalOpen(true);
  }

  //Abre diretamente o ConfirmModal
  function prepararDeletar(aviso: AvisoAula) {
    setAvisoSelecionado(aviso);
    setErro('');
    setSucesso('');
    setIsConfirmDeleteOpen(true);
  }

  function handleAlternarTurma(idTurma: number) {
    setTurmaSelecionada(prev =>
      prev.includes(idTurma)
        ? prev.filter(id => id !== idTurma)
        : [...prev, idTurma]
    );
  }

  //Publicar Aviso (POST)
  async function executarAdicionarAviso() {
    if (!user) return;

    if (!titulo.trim()) {
      setErro('O conteúdo do aviso é obrigatório.');
      return;
    }

    const turmasAlvo = enviarParaTodas
      ? turmas.map(t => t.idTurma)
      : turmaSelecionada;

    if (turmasAlvo.length === 0) {
      setErro('Selecione pelo menos uma turma de destino.');
      return;
    }

    setSalvando(true);
    setErro('');

    try {
      await Api.post('/aviso-aula', {
      titulo,
      imagemUrl: imagemUrl || undefined,
      idProfessor: user.papel === 'PROFESSOR' ? user.idUsuario : undefined,
      idsTurmas: turmasAlvo
    });

      setSucesso('Aviso publicado com sucesso!');
      await atualizarMural();
      setIsAddModalOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao publicar aviso.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  //Editar Aviso (PUT)
  async function executarEditarAviso() {
    if (!avisoSelecionado) return;

    if (!titulo.trim()) {
      setErro('O conteúdo do aviso é obrigatório.');
      return;
    }

    setSalvando(true);
    setErro('');

    try {
      await Api.put(`/aviso-aula/${avisoSelecionado.idAvisoAula}`, {
        titulo,
        imagemUrl: imagemUrl || null
      });

      setSucesso('Aviso atualizado com sucesso!');
      await atualizarMural();
      setIsEditModalOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao atualizar aviso.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  //Excluir Aviso (DELETE)
  async function executarDeletarAviso() {
    if (!avisoSelecionado) return;

    setSalvando(true);
    setErro('');

    try {
      await Api.delete(`/aviso-aula/${avisoSelecionado.idAvisoAula}`);
      setSucesso('Aviso excluído com sucesso!');
      await atualizarMural();
      setIsConfirmDeleteOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao excluir aviso.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  function podeGerenciarAviso(aviso: AvisoAula): boolean {
    if (!user) return false;
    if (user.papel === 'GESTOR') return true;
    return aviso.idProfessor === user.idUsuario;
  }

  return {
    turmas,
    avisos,
    titulo,
    setTitulo,
    imagemUrl,
    setImagemUrl,
    turmaSelecionada,
    setTurmaSelecionada,
    handleAlternarTurma,
    enviarParaTodas,
    setEnviarParaTodas,
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
    avisoSelecionado,
    abrirModalAdicionar,
    abrirModalEditar,
    prepararDeletar,
    executarAdicionarAviso,
    executarEditarAviso,
    executarDeletarAviso,
    podeGerenciarAviso
  };
}
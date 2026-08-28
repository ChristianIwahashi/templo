import { useEffect, useState } from "react";
import { UseAuth } from "./UseAuth";
import { Api } from "../api/Api";
import { AxiosError } from "axios";
import { padraoTelefone } from "../utils/telefone";

export interface ProfessorCompleto {
  idUsuario: number;
  nome: string;
  email: string;
  telefone: string;
  ativo: boolean;
  papel: string;
}

export function UseGerenciarProfessores() {
  const { user } = UseAuth();
  const [professores, setProfessores] = useState<ProfessorCompleto[]>([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [pesquisa, setPesquisa] = useState('');
  const [ocultarInativos, setOcultarInativos] = useState(true);
  const [profExpandidoId, setProfExpandidoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [professorSelecionado, setProfessorSelecionado] = useState<ProfessorCompleto | null>(null);
  const [isConfirmAddOpen, setIsConfirmAddOpen] = useState(false);
  const [isConfirmEditOpen, setIsConfirmEditOpen] = useState(false);
  const [isConfirmStatusOpen, setIsConfirmStatusOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    async function carregarProfessores() {
      try {
        setLoading(true);
        const response = await Api.get('/usuario');
        const todosProfessores = response.data.filter((u: any) => u.papel === 'PROFESSOR');
        setProfessores(todosProfessores);
      } catch (error) {
        console.error(error);
        setErro('Não foi possível carregar o corpo docente.');
      } finally {
        setLoading(false);
      }
    }
    carregarProfessores();
  }, []);

  //Recarrega a lista
  async function atualizarListaProfessores() {
    try {
      const response = await Api.get('/usuario');
      const todosProfessores = response.data.filter((u: any) => u.papel === 'PROFESSOR');
      setProfessores(todosProfessores);
    } catch (error) {
      console.error(error);
    }
  }

  //Modais
    function abrirModalCadastrar() {
    setNome('');
    setEmail('');
    setSenha('');
    setTelefone('');
    setErro('');
    setSucesso('');
    setIsAddModalOpen(true);
  }
  function abrirModalEditar(prof: ProfessorCompleto) {
    setProfessorSelecionado(prof);
    setNome(prof.nome);
    setEmail(prof.email);
    setTelefone(padraoTelefone(prof.telefone));
    setErro('');
    setSucesso('');
    setIsEditModalOpen(true);
  }
  function prepararDeletar(prof: ProfessorCompleto) {
    setProfessorSelecionado(prof);
    setErro('');
    setSucesso('');
    setIsConfirmDeleteOpen(true);
  }

  //Preparar Confirmações
  function prepararCadastrar() {
    if (!nome.trim() || !email.trim() || !senha.trim() || !telefone.trim()) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }
    setIsConfirmAddOpen(true);
  }
  function prepararEditar() {
    if (!nome.trim() || !email.trim() || !telefone.trim()) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }
    setIsConfirmEditOpen(true);
  }
  function prepararAlternarStatus(prof: ProfessorCompleto) {
    setProfessorSelecionado(prof);
    setIsConfirmStatusOpen(true);
  }

  //POST Professor
  async function executarCadastro() {
    if (!user) return;
    setIsConfirmAddOpen(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.post('/usuario', {
        nome,
        email,
        senha,
        telefone,
        ativo: true,
        papel: 'PROFESSOR',
        idGestor: user.idUsuario
      });

      setSucesso('Professor cadastrado com sucesso!');
      await atualizarListaProfessores();
      setIsAddModalOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao cadastrar professor.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  //PUT Professor
  async function executarEditarProfessor() {
    if (!professorSelecionado) return;
    setIsConfirmEditOpen(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.put(`/usuario/${professorSelecionado.idUsuario}`, {
        nome,
        email,
        telefone,
        ativo: professorSelecionado.ativo
      });

      setSucesso('Cadastro do professor atualizado com sucesso!');
      await atualizarListaProfessores();
      setIsEditModalOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao atualizar.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  //Status Professor
  async function executarAlternarStatusAtivo() {
    if (!professorSelecionado) return;
    setIsConfirmStatusOpen(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.put(`/usuario/${professorSelecionado.idUsuario}`, {
        nome: professorSelecionado.nome,
        email: professorSelecionado.email,
        telefone: professorSelecionado.telefone,
        ativo: !professorSelecionado.ativo
      });

      showToastSuccess(`Status do professor alterado para ${!professorSelecionado.ativo ? 'ATIVO' : 'INATIVO'}`);
      await atualizarListaProfessores();
    } catch (error) {
      console.error(error);
      setErro('Não foi possível alterar o status do professor.');
    } finally {
      setSalvando(false);
    }
  }

  //DELETE Professor
  async function executarDeletarProfessor() {
    if (!professorSelecionado) return;
    setIsConfirmDeleteOpen(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.delete(`/usuario/${professorSelecionado.idUsuario}`);
      setSucesso('Cadastro excluído permanentemente!');
      await atualizarListaProfessores();
      setIsConfirmDeleteOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao excluir cadastro.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  function showToastSuccess(msg: string) {
    setSucesso(msg);
    setTimeout(() => setSucesso(''), 3000);
  }

  //Filtros na tabela
  const professoresFiltrados = professores
    .filter(p => {
      const bateBusca = p.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
                        p.email.toLowerCase().includes(pesquisa.toLowerCase()) ||
                        p.idUsuario.toString().includes(pesquisa);
      const bateAtivo = ocultarInativos ? p.ativo === true : true;
      return bateBusca && bateAtivo;
    });

  return {
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
  };
}
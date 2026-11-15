import { useEffect, useState } from "react";
import { UseAuth } from "./UseAuth";
import { Api } from "../api/api";
import { AxiosError } from "axios";
import { padraoTelefone } from "../utils/telefone";

export interface GestorCompleto {
  idUsuario: number;
  nome: string;
  email: string;
  telefone: string;
  ativo: boolean;
  papel: string;
}

export function UseGerenciarGestores() {
  const { user } = UseAuth();
  const [gestores, setGestores] = useState<GestorCompleto[]>([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [pesquisa, setPesquisa] = useState('');
  const [ocultarInativos, setOcultarInativos] = useState(true);
  const [gestorExpandidoId, setGestorExpandidoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [erroModal, setErroModal] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [gestorSelecionado, setGestorSelecionado] = useState<GestorCompleto | null>(null);
  const [isConfirmAddOpen, setIsConfirmAddOpen] = useState(false);
  const [isConfirmEditOpen, setIsConfirmEditOpen] = useState(false);
  const [isConfirmStatusOpen, setIsConfirmStatusOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    async function carregarGestores() {
      try {
        setLoading(true);
        const response = await Api.get('/usuario');
        const todosGestores = response.data.filter((u: any) => u.papel === 'GESTOR');
        setGestores(todosGestores);
      } catch (error) {
        console.error(error);
        setErro('Não foi possível carregar a lista de administradores.');
      } finally {
        setLoading(false);
      }
    }
    carregarGestores();
  }, []);

  async function atualizarListaGestores() {
    try {
      const response = await Api.get('/usuario');
      const todosGestores = response.data.filter((u: any) => u.papel === 'GESTOR');
      setGestores(todosGestores);
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
    setErroModal('');
    setSucesso('');
    setIsAddModalOpen(true);
  }
  function abrirModalEditar(gestor: GestorCompleto) {
    setGestorSelecionado(gestor);
    setNome(gestor.nome);
    setEmail(gestor.email);
    setTelefone(padraoTelefone(gestor.telefone));
    setErroModal('');
    setSucesso('');
    setIsEditModalOpen(true);
  }
  function prepararDeletar(gestor: GestorCompleto) {
    if (user?.idUsuario === gestor.idUsuario) {
      setErro('Você não pode excluir a sua própria conta ativa de administrador.');
      return;
    }
    setGestorSelecionado(gestor);
    setErro('');
    setSucesso('');
    setIsConfirmDeleteOpen(true);
  }
  function fecharModais() {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setErroModal('');
  }
  function prepararCadastrar() {
    if (!nome.trim() || !email.trim() || !senha.trim() || !telefone.trim()) {
      setErroModal('Preencha todos os campos obrigatórios.');
      return;
    }
    setErroModal('');
    setIsConfirmAddOpen(true);
  }
  function prepararEditar() {
    if (!nome.trim() || !email.trim() || !telefone.trim()) {
      setErroModal('Preencha todos os campos obrigatórios.');
      return;
    }
    setErroModal('');
    setIsConfirmEditOpen(true);
  }
  function prepararAlternarStatus(gestor: GestorCompleto) {
    if (user?.idUsuario === gestor.idUsuario) {
      setErro('Você não pode desativar a sua própria conta de administrador em uso.');
      return;
    }
    setGestorSelecionado(gestor);
    setIsConfirmStatusOpen(true);
  }

  //POST Gestor
  async function executarCadastro() {
    if (!user) return;
    setIsConfirmAddOpen(false);
    setSalvando(true);
    setErroModal('');

    try {
      await Api.post('/usuario', {
        nome,
        email,
        senha,
        telefone,
        ativo: true,
        papel: 'GESTOR'
      });

      showToastSuccess('Administrador cadastrado com sucesso!');
      await atualizarListaGestores();
      setIsAddModalOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErroModal(error.response?.data?.message || 'Erro ao cadastrar administrador.');
      } else {
        setErroModal('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  //PUT Gestor
  async function executarEditarGestor() {
    if (!gestorSelecionado) return;
    setIsConfirmEditOpen(false);
    setSalvando(true);
    setErroModal('');

    try {
      await Api.put(`/usuario/${gestorSelecionado.idUsuario}`, {
        nome,
        email,
        telefone,
        ativo: gestorSelecionado.ativo
      });

      showToastSuccess('Cadastro de administrador atualizado com sucesso!');
      await atualizarListaGestores();
      setIsEditModalOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErroModal(error.response?.data?.message || 'Erro ao atualizar.');
      } else {
        setErroModal('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  //Status Professor
  async function executarAlternarStatusAtivo() {
    if (!gestorSelecionado) return;
    setIsConfirmStatusOpen(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.put(`/usuario/${gestorSelecionado.idUsuario}`, {
        nome: gestorSelecionado.nome,
        email: gestorSelecionado.email,
        telefone: gestorSelecionado.telefone,
        ativo: !gestorSelecionado.ativo
      });

      showToastSuccess(`Status alterado para ${!gestorSelecionado.ativo ? 'ATIVO' : 'INATIVO'}`);
      await atualizarListaGestores();
    } catch (error) {
      console.error(error);
      setErro('Não foi possível alterar o status do administrador.');
    } finally {
      setSalvando(false);
    }
  }

  //DELETE Gestor
  async function executarDeletarGestor() {
    if (!gestorSelecionado) return;
    setIsConfirmDeleteOpen(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.delete(`/usuario/${gestorSelecionado.idUsuario}`);
      showToastSuccess('Administrador excluído permanentemente!');
      await atualizarListaGestores();
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao excluir conta.');
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

  const gestoresFiltrados = gestores.filter(g => {
    const bateBusca = g.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
                      g.email.toLowerCase().includes(pesquisa.toLowerCase()) ||
                      g.idUsuario.toString().includes(pesquisa);
    const bateAtivo = ocultarInativos ? g.ativo === true : true;
    return bateBusca && bateAtivo;
  });

  return {
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
    erroModal,
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
    fecharModais,
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
  };
}
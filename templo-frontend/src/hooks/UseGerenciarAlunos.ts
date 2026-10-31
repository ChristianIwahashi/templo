import { useEffect, useState } from "react";
import { UseAuth } from "./UseAuth";
import { Api } from "../api/api";
import { AxiosError } from "axios";
import { padraoTelefone } from "../utils/telefone";

export interface Turma {
  idTurma: number;
  nome?: string;
}

export interface AlunoCompleto {
  idUsuario: number;
  nome: string;
  email: string;
  telefone: string;
  ativo: boolean;
  papel: string;
  aluno?: {
    dataNascimento: string;
    idTurma?: number | null;
  }
}

export function UseGerenciarAlunos() {
  const { user } = UseAuth();

  // Estados de dados
  const [alunos, setAlunos] = useState<AlunoCompleto[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);

  // Estados do formulário (Matrícula / Edição)
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [turmaSelecionada, setTurmaSelecionada] = useState('');

  // Estados de busca
  const [pesquisa, setPesquisa] = useState('');
  const [ocultarInativos, setOcultarInativos] = useState(false);
  const [profExpandidoId, setProfExpandidoId] = useState<number | null>(null);

  // Estados de controle de UI
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Modais de formulário
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState<AlunoCompleto | null>(null);

  // Modais de Confirmação (ConfirmModal)
  const [isConfirmAddOpen, setIsConfirmAddOpen] = useState(false);
  const [isConfirmEditOpen, setIsConfirmEditOpen] = useState(false);
  const [isConfirmStatusOpen, setIsConfirmStatusOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // 1. Carrega alunos e turmas em paralelo
  useEffect(() => {
    async function carregarDadosSecretaria() {
      try {
        setLoading(true);
        const [usuariosRes, turmasRes] = await Promise.all([
          Api.get('/usuario'),
          Api.get('/turma')
        ]);

        const todosAlunos = usuariosRes.data.filter((u: any) => u.papel === 'ALUNO');
        setAlunos(todosAlunos);
        setTurmas(turmasRes.data);
      } catch (error) {
        console.error(error);
        setErro('Não foi possível carregar a lista de alunos.');
      } finally {
        setLoading(false);
      }
    }
    carregarDadosSecretaria();
  }, []);

  async function atualizarListaAlunos() {
    try {
      const response = await Api.get('/usuario');
      const todosAlunos = response.data.filter((u: any) => u.papel === 'ALUNO');
      setAlunos(todosAlunos);
    } catch (error) {
      console.error(error);
    }
  }

  // --- Handlers de Abertura ---

  function abrirModalMatricular() {
    setNome('');
    setEmail('');
    setSenha('');
    setTelefone('');
    setDataNascimento('');
    setTurmaSelecionada('');
    setErro('');
    setSucesso('');
    setIsAddModalOpen(true);
  }

  function abrirModalEditar(aluno: AlunoCompleto) {
    setAlunoSelecionado(aluno);
    setNome(aluno.nome);
    setEmail(aluno.email);
    setTelefone(padraoTelefone(aluno.telefone || ''));
    setTurmaSelecionada(aluno.aluno?.idTurma ? aluno.aluno.idTurma.toString() : '');
    setDataNascimento(aluno.aluno?.dataNascimento ? new Date(aluno.aluno.dataNascimento).toISOString().split('T')[0] : '');
    setErro('');
    setSucesso('');
    setIsEditModalOpen(true);
  }

  function abrirModalDeletar(aluno: AlunoCompleto) {
    setAlunoSelecionado(aluno);
    setErro('');
    setSucesso('');
    setIsConfirmDeleteOpen(true);
  }

  function prepararCadastrar() {
    if (!nome.trim() || !email.trim() || !senha.trim() || !telefone.trim() || !dataNascimento.trim()) {
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

  function prepararAlternarStatus(aluno: AlunoCompleto) {
    setAlunoSelecionado(aluno);
    setIsConfirmStatusOpen(true);
  }

  // AÇÃO: Matricular Aluno (POST /usuario)
  async function executarMatricula() {
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
        papel: 'ALUNO',
        dataNascimento,
        idGestor: user.idUsuario,
        idTurma: turmaSelecionada ? Number(turmaSelecionada) : undefined
      });

      setSucesso('Aluno matriculado com sucesso!');
      await atualizarListaAlunos();
      setIsAddModalOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao realizar matrícula.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  // AÇÃO: Editar Cadastro do Aluno (PUT /usuario/:id)
  async function executarEditarAluno() {
    if (!alunoSelecionado) return;
    setIsConfirmEditOpen(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.put(`/usuario/${alunoSelecionado.idUsuario}`, {
        nome,
        email,
        telefone,
        ativo: alunoSelecionado.ativo,
        // 📍 Envia o idTurma atualizado (ou null se desvincular)
        idTurma: turmaSelecionada ? Number(turmaSelecionada) : null
      });

      setSucesso('Cadastro do aluno atualizado com sucesso!');
      await atualizarListaAlunos();
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

  // AÇÃO: Alternar Status Ativo/Inativo
  async function executarAlternarStatusAtivo() {
    if (!alunoSelecionado) return;
    setIsConfirmStatusOpen(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.put(`/usuario/${alunoSelecionado.idUsuario}`, {
        nome: alunoSelecionado.nome,
        email: alunoSelecionado.email,
        telefone: alunoSelecionado.telefone,
        ativo: !alunoSelecionado.ativo
      });

      showToastSuccess(`Status do aluno alterado para ${!alunoSelecionado.ativo ? 'ATIVO' : 'INATIVO'}`);
      await atualizarListaAlunos();
    } catch (error) {
      console.error(error);
      setErro('Não foi possível alterar o status do aluno.');
    } finally {
      setSalvando(false);
    }
  }

  // AÇÃO: Deletar Aluno (DELETE /usuario/:id)
  async function executarDeletarAluno() {
    if (!alunoSelecionado) return;
    setIsConfirmDeleteOpen(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.delete(`/usuario/${alunoSelecionado.idUsuario}`);
      setSucesso('Matrícula excluída permanentemente!');
      await atualizarListaAlunos();
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao excluir matrícula.');
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

  const alunosFiltrados = alunos.filter(a => {
    const bateBusca = a.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
                      a.email.toLowerCase().includes(pesquisa.toLowerCase()) ||
                      a.idUsuario.toString().includes(pesquisa);
    const bateAtivo = ocultarInativos ? a.ativo === true : true;
    return bateBusca && bateAtivo;
  });

  return {
    alunosFiltrados,
    turmas,
    nome,
    setNome,
    email,
    setEmail,
    senha,
    setSenha,
    telefone,
    setTelefone,
    dataNascimento,
    setDataNascimento,
    turmaSelecionada,
    setTurmaSelecionada,
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
    isConfirmAddOpen,
    setIsConfirmAddOpen,
    isConfirmEditOpen,
    setIsConfirmEditOpen,
    isConfirmStatusOpen,
    setIsConfirmStatusOpen,
    isConfirmDeleteOpen,
    setIsConfirmDeleteOpen,
    alunoSelecionado,
    abrirModalMatricular,
    abrirModalEditar,
    abrirModalDeletar,
    prepararCadastrar,
    prepararEditar,
    prepararAlternarStatus,
    executarMatricula,
    executarEditarAluno,
    executarDeletarAluno,
    executarAlternarStatusAtivo
  };
}
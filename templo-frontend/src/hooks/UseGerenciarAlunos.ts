import { useEffect, useState } from "react";
import { UseAuth } from "./UseAuth";
import { Api } from "../api/Api";
import { AxiosError } from "axios";
import { padraoTelefone } from "../utils/telefone";
export const regexTextoSeguro = /^(?=.*[a-zA-Z0-9À-ÿ])[a-zA-Z0-9À-ÿ\s.!?,;\-_@()]+$/;

export interface Turma {
  idTurma: number;
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
  const [alunos, setAlunos] = useState<AlunoCompleto[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  const [pesquisa, setPesquisa] = useState('');
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState<AlunoCompleto | null>(null);
  const [ocultarInativos, setOcultarInativos] = useState(true);
  const [alunoExpandidoId, setAlunoExpandidoId] = useState<number | null>(null);
  const [isConfirmAddOpen, setIsConfirmAddOpen] = useState(false);
  const [isConfirmEditOpen, setIsConfirmEditOpen] = useState(false);
  const [isConfirmStatusOpen, setIsConfirmStatusOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)

  useEffect(() => {
    async function carregarDadosSecretaria() {
      try {
        setLoading(true);
        const [usuariosRes, turmasRes] = await Promise.all([
          Api.get('/usuario'),
          Api.get('/turma')
        ]);
        //Filtra para usuários Aluno
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

  //Sincronizar a tela
  async function atualizarListaAlunos() {
    try {
      const response = await Api.get('/usuario');
      const todosAlunos = response.data.filter((u: any) => u.papel === 'ALUNO');
      setAlunos(todosAlunos);
    } catch (error) {
      console.error(error);
    }
  }

  //Modais
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
    setTelefone(padraoTelefone(aluno.telefone));
    setTurmaSelecionada(aluno.aluno?.idTurma ? aluno.aluno.idTurma.toString() : '');
    setDataNascimento(aluno.aluno?.dataNascimento ? new Date(aluno.aluno.dataNascimento).toISOString().split('T')[0] : '');
    setErro('');
    setSucesso('');
    setIsEditModalOpen(true);
  }
  function prepararDeletarAluno(aluno: AlunoCompleto) {
    setAlunoSelecionado(aluno);
    setErro('');
    setSucesso('');
    setIsConfirmDeleteOpen(true);
  }

  function prepararMatricula() {
    if (!nome.trim() || !email.trim() || !senha.trim() || !telefone.trim() || !dataNascimento.trim()) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    if (senha.length < 6) {
        setErro('A senha inicial deve ter pelo menos 6 caracteres.');
        return;
    }
    if (!regexTextoSeguro.test(senha)) {
        setErro('A senha contém caracteres inválidos. Use apenas letras, números e caracteres especiais.');
        return;
    }

    setErro('');
    setIsConfirmAddOpen(true);
  }

  //POST Aluno
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

  function prepararEditarAluno() {
    if (!nome.trim() || !email.trim() || !telefone.trim()) {
      setErro('Preencha os campos obrigatórios.');
      return;
    }
    setErro('');
    setIsConfirmEditOpen(true);
  }

  //PUT Aluno
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

  function prepararAlternarStatus(aluno: AlunoCompleto) {
    setAlunoSelecionado(aluno);
    setErro('');
    setSucesso('');
    setIsConfirmStatusOpen(true);
  }

  //Status Aluno
  async function executarAlternarStatusAtivo() {
    if (!alunoSelecionado) return;
    setIsConfirmStatusOpen(false);
    setErro('');
    setSucesso('');

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
    }
  }

  async function executarDeletarAluno() {
    if (!alunoSelecionado) return;
    setIsConfirmDeleteOpen(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.delete(`/usuario/${alunoSelecionado.idUsuario}`);
      setSucesso('Matrícula do aluno excluída permanentemente!');
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

  //Filtragem na tabela
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
    loading,
    salvando,
    erro,
    sucesso,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    alunoSelecionado,
    abrirModalMatricular,
    abrirModalEditar,
    executarMatricula,
    executarEditarAluno,
    ocultarInativos,
    setOcultarInativos,
    alunoExpandidoId,
    setAlunoExpandidoId,
    setIsConfirmAddOpen,
    isConfirmAddOpen,
    setIsConfirmEditOpen,
    isConfirmEditOpen,
    setIsConfirmStatusOpen,
    isConfirmStatusOpen,
    isConfirmDeleteOpen,
    setIsConfirmDeleteOpen,
    prepararMatricula,
    prepararEditarAluno,
    prepararDeletarAluno,
    prepararAlternarStatus,
    executarAlternarStatusAtivo,
    executarDeletarAluno
  };
}
import { useEffect, useState } from "react";
import { Api } from "../api/Api";
import { AxiosError } from "axios";

export interface AlunoNaTurma {
  idUsuario: number;
  usuario: {
    nome: string;
    email: string;
  };
}
export interface ProfessorNaTurma {
  idUsuario: number;
  usuario: {
    nome: string;
    email: string;
  };
}
export interface TurmaCompleta {
  idTurma: number;
  idProfessor: number;
  professor: ProfessorNaTurma;
  alunos: AlunoNaTurma[];
}
export interface ProfessorOpcao {
  idUsuario: number;
  nome: string;
  ativo: boolean;
}
export interface AlunoOpcao {
  idUsuario: number;
  nome: string;
  email: string;
  idTurmaAtual?: number | null;
}

export function UseGerenciarTurmas() {
  const [turmas, setTurmas] = useState<TurmaCompleta[]>([]);
  const [professores, setProfessores] = useState<ProfessorOpcao[]>([]);
  const [alunosDisponiveis, setAlunosDisponiveis] = useState<AlunoOpcao[]>([]);
  const [idProfessorSelecionado, setIdProfessorSelecionado] = useState<string>('');
  const [idAlunoSelecionado, setIdAlunoSelecionado] = useState<string>('');
  const [pesquisa, setPesquisa] = useState('');
  const [turmaExpandidaId, setTurmaExpandidaId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMatricularModalOpen, setIsMatricularModalOpen] = useState(false);
  const [turmaSelecionada, setTurmaSelecionada] = useState<TurmaCompleta | null>(null);
  const [isConfirmAddOpen, setIsConfirmAddOpen] = useState(false);
  const [isConfirmEditOpen, setIsConfirmEditOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isConfirmMatricularOpen, setIsConfirmMatricularOpen] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const [turmasRes, usuariosRes] = await Promise.all([
          Api.get('/turma'),
          Api.get('/usuario')
        ]);

        setTurmas(turmasRes.data);

        const listaProfessores = usuariosRes.data
          .filter((u: any) => u.papel === 'PROFESSOR' && u.ativo)
          .map((p: any) => ({
            idUsuario: p.idUsuario,
            nome: p.nome,
            ativo: p.ativo
          }));

          const listaAlunos = usuariosRes.data
          .filter((u: any) => u.papel === 'ALUNO' && u.ativo)
          .map((a: any) => ({
            idUsuario: a.idUsuario,
            nome: a.nome,
            email: a.email,
            idTurmaAtual: a.aluno?.idTurma ?? null
          }));

        setProfessores(listaProfessores);
        setAlunosDisponiveis(listaAlunos);
      } catch (error) {
        console.error(error);
        setErro('Não foi possível carregar as turmas e dados de usuários.');
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  async function atualizarTurmas() {
    try {
      const [turmasRes, usuariosRes] = await Promise.all([
        Api.get('/turma'),
        Api.get('/usuario')
      ]);
      setTurmas(turmasRes.data);

      const listaAlunos = usuariosRes.data
        .filter((u: any) => u.papel === 'ALUNO' && u.ativo)
        .map((a: any) => ({
          idUsuario: a.idUsuario,
          nome: a.nome,
          email: a.email,
          idTurmaAtual: a.aluno?.idTurma ?? null
        }));
      setAlunosDisponiveis(listaAlunos);
    } catch (error) {
      console.error(error);
    }
  }

  //Modais
  function abrirModalCriar() {
    setIdProfessorSelecionado('');
    setErro('');
    setSucesso('');
    setIsAddModalOpen(true);
  }
  function abrirModalEditar(turma: TurmaCompleta) {
    setTurmaSelecionada(turma);
    setIdProfessorSelecionado(turma.idProfessor.toString());
    setErro('');
    setSucesso('');
    setIsEditModalOpen(true);
  }
  function abrirModalMatricularAluno(turma: TurmaCompleta) {
    setTurmaSelecionada(turma);
    setIdAlunoSelecionado('');
    setErro('');
    setSucesso('');
    setIsMatricularModalOpen(true);
  }
  function prepararDeletar(turma: TurmaCompleta) {
    setTurmaSelecionada(turma);
    setErro('');
    setSucesso('');
    setIsConfirmDeleteOpen(true);
  }
  function prepararCriar() {
    if (!idProfessorSelecionado) {
      setErro('Selecione um professor responsável para a turma.');
      return;
    }
    setIsConfirmAddOpen(true);
  }
  function prepararEditar() {
    if (!idProfessorSelecionado) {
      setErro('Selecione um professor responsável.');
      return;
    }
    setIsConfirmEditOpen(true);
  }
  function prepararMatricular() {
    if (!idAlunoSelecionado) {
      setErro('Selecione um aluno para vincular a esta turma.');
      return;
    }
    setIsConfirmMatricularOpen(true);
  }

  //POST Turma
  async function executarCriarTurma() {
    setIsConfirmAddOpen(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.post('/turma', {
        idProfessor: Number(idProfessorSelecionado)
      });

      setSucesso('Turma criada com sucesso!');
      await atualizarTurmas();
      setIsAddModalOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao criar turma.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  //PUT Turma
  async function executarEditarTurma() {
    if (!turmaSelecionada) return;
    setIsConfirmEditOpen(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.put(`/turma/${turmaSelecionada.idTurma}`, {
        idProfessor: Number(idProfessorSelecionado)
      });

      setSucesso('Professor responsável atualizado com sucesso!');
      await atualizarTurmas();
      setIsEditModalOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao atualizar turma.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  //POST Turma(matricular)
  async function executarMatricularAluno() {
    if (!turmaSelecionada || !idAlunoSelecionado) return;
    setIsConfirmMatricularOpen(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.post(`/turma/${turmaSelecionada.idTurma}/matricular`, {
        idAluno: Number(idAlunoSelecionado)
      });

      setSucesso('Aluno vinculado à turma com sucesso!');
      await atualizarTurmas();
      setIsMatricularModalOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao vincular aluno.');
      } else {
        setErro('Erro inesperado ao vincular aluno.');
      }
    } finally {
      setSalvando(false);
    }
  }

  //DELETE Turma
  async function executarDeletarTurma() {
    if (!turmaSelecionada) return;
    setIsConfirmDeleteOpen(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.delete(`/turma/${turmaSelecionada.idTurma}`);
      setSucesso('Turma excluída permanentemente!');
      await atualizarTurmas();
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao excluir turma.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  //Filtragem dinâmica
  const alunoSelecionadoObj = alunosDisponiveis.find(
    a => a.idUsuario.toString() === idAlunoSelecionado
  );

  const turmasFiltradas = turmas.filter(t => 
    t.idTurma.toString().includes(pesquisa) ||
    t.professor?.usuario?.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return {
    turmasFiltradas,
    professores,
    alunosDisponiveis,
    idProfessorSelecionado,
    setIdProfessorSelecionado,
    idAlunoSelecionado,
    setIdAlunoSelecionado,
    alunoSelecionadoObj,
    pesquisa,
    setPesquisa,
    turmaExpandidaId,
    setTurmaExpandidaId,
    loading,
    salvando,
    erro,
    sucesso,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isMatricularModalOpen,
    setIsMatricularModalOpen,
    isConfirmAddOpen,
    setIsConfirmAddOpen,
    isConfirmEditOpen,
    setIsConfirmEditOpen,
    isConfirmDeleteOpen,
    setIsConfirmDeleteOpen,
    isConfirmMatricularOpen,
    setIsConfirmMatricularOpen,
    turmaSelecionada,
    abrirModalCriar,
    abrirModalEditar,
    abrirModalMatricularAluno,
    prepararDeletar,
    prepararCriar,
    prepararEditar,
    prepararMatricular,
    executarCriarTurma,
    executarEditarTurma,
    executarMatricularAluno,
    executarDeletarTurma
  };
}
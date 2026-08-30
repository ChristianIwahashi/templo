import { useEffect, useState } from "react";
import { UseAuth } from "./UseAuth";
import { Api } from "../api/Api";
import { AxiosError } from "axios";
import type { AutorAuditoria } from "../components/InfoAuditoria";

export interface Aluno {
  idUsuario: number;
  idProfessor: number;
  usuario: { nome: string };
}
export interface Turma {
  idTurma: number;
  idProfessor: number;
  alunos?: Aluno[];
}
export interface Material {
  idMaterial: number;
  titulo: string;
  descricao: string;
  arquivoUrl: string;
  idProfessor: number;
  dataPostagem: string;
  criadoEm?: string;
  atualizadoEm?: string;
  criadoPor?: AutorAuditoria | null;
  atualizadoPor?: AutorAuditoria | null;
  turmasVinculadas?: { idTurma: number }[];

  alunosVinculados?: {
    idAluno: number;
    aluno: {
      usuario: {
        nome: string;
      }
    }
  }[];
}

export function UseGerenciarMateriais() {
  const { user } = UseAuth();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [alunosDaTurma, setAlunosDaTurma] = useState<Aluno[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [arquivoUrl, setArquivoUrl] = useState('');
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  const [isExclusivo, setIsExclusivo] = useState(false);
  const [alunosSelecionados, setAlunosSelecionados] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAlunos, setLoadingAlunos] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [materialSelecionado, setMaterialSelecionado] = useState<Material | null>(null);

  useEffect(() => {
    async function carregarDadosIniciais() {
      try {
        setLoading(true);
        const [turmasRes, materiaisRes] = await Promise.all([
          Api.get('/turma'),
          Api.get('/material-didatico')
        ]);
        setTurmas(turmasRes.data);
        setMateriais(materiaisRes.data);
      } catch (error) {
        console.error(error);
        setErro('Não foi possível carregar os dados iniciais.');
      } finally {
        setLoading(false);
      }
    }
    carregarDadosIniciais();
  }, []);

  useEffect(() => {
    if (!turmaSelecionada) {
      setAlunosDaTurma([]);
      setAlunosSelecionados([]);
      return;
    }

    async function carregarAlunos() {
      try {
        setLoadingAlunos(true);
        const response = await Api.get(`/turma/${turmaSelecionada}`);
        if (response.data?.alunos) {
          setAlunosDaTurma(response.data.alunos);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingAlunos(false);
      }
    }
    carregarAlunos();
  }, [turmaSelecionada]);

  //Sincronizar tela
  async function atualizarListaMateriais() {
    try {
      const response = await Api.get('/material-didatico');
      setMateriais(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  //Alternar seleção de aluno
  function handleAlternarAlunoExclusivo(idAluno: number) {
    setAlunosSelecionados(prev => 
      prev.includes(idAluno) 
        ? prev.filter(id => id !== idAluno) 
        : [...prev, idAluno]
    );
  }

  //Modais
  function abrirModalAdicionar() {
    setTitulo('');
    setDescricao('');
    setArquivoUrl('');
    setTurmaSelecionada('');
    setIsExclusivo(false);
    setAlunosSelecionados([]);
    setErro('');
    setSucesso('');
    setIsAddModalOpen(true);
  }
  function abrirModalEditar(material: Material) {
    setMaterialSelecionado(material);
    setTitulo(material.titulo);
    setDescricao(material.descricao);
    setArquivoUrl(material.arquivoUrl);
    setErro('');
    setSucesso('');
    setIsEditModalOpen(true);
  }
  function abrirModalDeletar(material: Material) {
    setMaterialSelecionado(material);
    setErro('');
    setSucesso('');
    setIsDeleteModalOpen(true);
  }

  //POST Material
  async function executarAdicionarMaterial() {
    if (!user) return;

    if (!titulo.trim() || !descricao.trim() || !arquivoUrl.trim()) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }
    if (!turmaSelecionada) {
      setErro('Selecione uma turma de destino.');
      return;
    }
    if (isExclusivo && alunosSelecionados.length === 0) {
      setErro('Selecione ao menos um aluno exclusivo para este material.');
      return;
    }

    setSalvando(true);
    setErro('');

    const turmaAtual = turmas.find(t => t.idTurma.toString() === turmaSelecionada);
    const professorId = (user?.papel === 'GESTOR' ? turmaAtual?.idProfessor : user?.idUsuario) || turmaAtual?.idProfessor;

    try {
      await Api.post('/material-didatico', {
        titulo,
        descricao,
        arquivoUrl,
        idProfessor: professorId,
        idTurma: isExclusivo ? undefined : Number(turmaSelecionada),
        idAluno: isExclusivo ? alunosSelecionados : undefined
      });

      setSucesso('Material publicado com sucesso!');
      await atualizarListaMateriais();
      setIsAddModalOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao publicar material.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  //PUT Material
  async function executarEditarMaterial() {
    if (!materialSelecionado) return;

    setSalvando(true);
    setErro('');

    try {
      await Api.put(`/material-didatico/${materialSelecionado.idMaterial}`, {
        titulo,
        descricao,
        arquivoUrl
      });

      setSucesso('Material atualizado com sucesso!');
      await atualizarListaMateriais();
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

  //DELETE Material
  async function executarDeletarMaterial() {
    if (!materialSelecionado) return;

    setSalvando(true);
    setErro('');

    try {
      await Api.delete(`/material-didatico/${materialSelecionado.idMaterial}`);
      setSucesso('Material excluído com sucesso!');
      await atualizarListaMateriais();
      setIsDeleteModalOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao excluir.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  return {
    turmas,
    materiais,
    alunosDaTurma,
    titulo,
    setTitulo,
    descricao,
    setDescricao,
    arquivoUrl,
    setArquivoUrl,
    turmaSelecionada,
    setTurmaSelecionada,
    isExclusivo,
    setIsExclusivo,
    alunosSelecionados,
    handleAlternarAlunoExclusivo,
    loading,
    loadingAlunos,
    salvando,
    erro,
    sucesso,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    materialSelecionado,
    abrirModalAdicionar,
    abrirModalEditar,
    abrirModalDeletar,
    executarAdicionarMaterial,
    executarEditarMaterial,
    executarDeletarMaterial,
    setErro,
    setSucesso
  };
}
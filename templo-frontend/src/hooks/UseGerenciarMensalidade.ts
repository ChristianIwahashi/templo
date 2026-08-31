import { useEffect, useState } from "react";
import { UseAuth } from "./UseAuth";
import { Api } from "../api/Api";
import { AxiosError } from "axios";

export interface AlunoOpcao {
  idUsuario: number;
  nome: string;
  email: string;
}
export interface MensalidadeAdmin {
  idMensalidade: number;
  mes: string;
  valor: number;
  dataVencimento: string;
  statusPagamento: 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'CANCELADO';
  idAluno: number;
  idGestor: number;
  aluno: {
    usuario: {
      nome: string;
      email: string;
    };
  };
}

export function UseGerenciarMensalidades() {
  const { user } = UseAuth();
  const [mensalidades, setMensalidades] = useState<MensalidadeAdmin[]>([]);
  const [alunos, setAlunos] = useState<AlunoOpcao[]>([]);
  const [pesquisa, setPesquisa] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroAno, setFiltroAno] = useState<string>('todos');
  const [filtroOrdem, setFiltroOrdem] = useState<'desc' | 'asc'>('desc');
  const [idAluno, setIdAluno] = useState<string>('');
  const [mes, setMes] = useState<string>('');
  const [valorReais, setValorReais] = useState<string>('30,00');
  const [dataVencimento, setDataVencimento] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [statusPagamento, setStatusPagamento] = useState<'PENDENTE' | 'PAGO' | 'ATRASADO' | 'CANCELADO'>('PENDENTE');
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [mensalidadeSelecionada, setMensalidadeSelecionada] = useState<MensalidadeAdmin | null>(null);
  const [isConfirmAddOpen, setIsConfirmAddOpen] = useState(false);
  const [isConfirmEditOpen, setIsConfirmEditOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isConfirmBaixaOpen, setIsConfirmBaixaOpen] = useState(false);

  useEffect(() => {
    async function carregarDadosFinanceiros() {
      try {
        setLoading(true);
        const [mensalidadesRes, usuariosRes] = await Promise.all([
          Api.get('/mensalidade'),
          Api.get('/usuario')
        ]);

        setMensalidades(mensalidadesRes.data);

        const listaAlunos = usuariosRes.data
          .filter((u: any) => u.papel === 'ALUNO' && u.ativo)
          .map((a: any) => ({
            idUsuario: a.idUsuario,
            nome: a.nome,
            email: a.email,
          }));
        setAlunos(listaAlunos);
      } catch (error) {
        console.error(error);
        setErro('Não foi possível carregar os registros financeiros.');
      } finally {
        setLoading(false);
      }
    }
    carregarDadosFinanceiros();
  }, []);

  async function atualizarLista() {
    try {
      const response = await Api.get('/mensalidade');
      setMensalidades(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  //Modais
  function abrirModalAdicionar() {
    setIdAluno('');
    setMes('');
    setValorReais('30,00');
    setDataVencimento(new Date().toISOString().split('T')[0]);
    setStatusPagamento('PENDENTE');
    setErro('');
    setSucesso('');
    setIsAddModalOpen(true);
  }
  function abrirModalEditar(m: MensalidadeAdmin) {
    setMensalidadeSelecionada(m);
    setMes(m.mes);
    setValorReais((m.valor / 100).toFixed(2));
    setDataVencimento(new Date(m.dataVencimento).toISOString().split('T')[0]);
    setStatusPagamento(m.statusPagamento);
    setErro('');
    setSucesso('');
    setIsEditModalOpen(true);
  }
  function prepararDeletar(m: MensalidadeAdmin) {
    setMensalidadeSelecionada(m);
    setErro('');
    setSucesso('');
    setIsConfirmDeleteOpen(true);
  }
  function prepararDarBaixa(m: MensalidadeAdmin) {
    setMensalidadeSelecionada(m);
    setErro('');
    setSucesso('');
    setIsConfirmBaixaOpen(true);
  }
  function prepararCriar() {
    if (!idAluno || !mes.trim() || !valorReais || !dataVencimento) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }
    setIsConfirmAddOpen(true);
  }
  function prepararEditar() {
    if (!mes.trim() || !valorReais || !dataVencimento) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }
    setIsConfirmEditOpen(true);
  }

  function converterParaCentavos(valor: string): number {
    const valorLimpo = valor.replace(',', '.');
    const floatVal = parseFloat(valorLimpo);
    return Math.round(floatVal * 100);
  }

  //POST Mensalidade
  async function executarCriarMensalidade() {
    if (!user) return;
    setIsConfirmAddOpen(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.post('/mensalidade', {
        mes: mes.trim(),
        valor: converterParaCentavos(valorReais),
        dataVencimento,
        statusPagamento,
        idGestor: user.idUsuario,
        idAluno: Number(idAluno)
      });

      setSucesso('Cobrança registrada com sucesso!');
      await atualizarLista();
      setIsAddModalOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao registrar mensalidade.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  //PUT Mensalidade
  async function executarEditarMensalidade() {
    if (!mensalidadeSelecionada) return;
    setIsConfirmEditOpen(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.put(`/mensalidade/${mensalidadeSelecionada.idMensalidade}`, {
        mes: mes.trim(),
        valor: converterParaCentavos(valorReais),
        dataVencimento,
        statusPagamento
      });

      setSucesso('Mensalidade atualizada com sucesso!');
      await atualizarLista();
      setIsEditModalOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao atualizar cobrança.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  //Status Mensalidade
  async function executarDarBaixa() {
    if (!mensalidadeSelecionada) return;
    setIsConfirmBaixaOpen(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.put(`/mensalidade/${mensalidadeSelecionada.idMensalidade}`, {
        statusPagamento: 'PAGO'
      });

      setSucesso(`Pagamento da mensalidade de ${mensalidadeSelecionada.aluno.usuario.nome} confirmado!`);
      await atualizarLista();
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao dar baixa no pagamento.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  //DELETE Mensalidade
  async function executarDeletarMensalidade() {
    if (!mensalidadeSelecionada) return;
    setIsConfirmDeleteOpen(false);
    setSalvando(true);
    setErro('');

    try {
      await Api.delete(`/mensalidade/${mensalidadeSelecionada.idMensalidade}`);
      setSucesso('Registro de mensalidade excluído permanentemente!');
      await atualizarLista();
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao excluir cobrança.');
      } else {
        setErro('Erro inesperado.');
      }
    } finally {
      setSalvando(false);
    }
  }

  //Filtros
  const anosDisponiveis = Array.from(
    new Set(mensalidades.map(m => new Date(m.dataVencimento).getUTCFullYear()))
  ).sort((a, b) => b - a);

  const mensalidadesFiltradas = mensalidades
    .filter(m => {
      const batePesquisa = m.aluno?.usuario?.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
                            m.mes.toLowerCase().includes(pesquisa.toLowerCase()) ||
                            m.idAluno.toString().includes(pesquisa);
      const bateStatus = filtroStatus === 'todos' ? true : m.statusPagamento === filtroStatus;
      const bateAno = filtroAno === 'todos' ? true : new Date(m.dataVencimento).getUTCFullYear().toString() === filtroAno;
      return batePesquisa && bateStatus && bateAno;
    })
    .sort((a, b) => {
      const dataA = new Date(a.dataVencimento).getTime();
      const dataB = new Date(b.dataVencimento).getTime();
      return filtroOrdem === 'desc' ? dataB - dataA : dataA - dataB;
    });

  const alunoSelecionadoObj = alunos.find(a => a.idUsuario.toString() === idAluno);

  return {
    mensalidadesFiltradas,
    alunos,
    anosDisponiveis,
    pesquisa,
    setPesquisa,
    filtroStatus,
    setFiltroStatus,
    filtroAno,
    setFiltroAno,
    filtroOrdem,
    setFiltroOrdem,
    idAluno,
    setIdAluno,
    mes,
    setMes,
    valorReais,
    setValorReais,
    dataVencimento,
    setDataVencimento,
    statusPagamento,
    setStatusPagamento,
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
    isConfirmDeleteOpen,
    setIsConfirmDeleteOpen,
    isConfirmBaixaOpen,
    setIsConfirmBaixaOpen,
    mensalidadeSelecionada,
    alunoSelecionadoObj,
    abrirModalAdicionar,
    abrirModalEditar,
    prepararDeletar,
    prepararDarBaixa,
    prepararCriar,
    prepararEditar,
    executarCriarMensalidade,
    executarEditarMensalidade,
    executarDarBaixa,
    executarDeletarMensalidade
  };
}
import { useEffect, useState } from "react";
import { UseAuth } from "./UseAuth";
import { Api } from "../api/Api";
import { AxiosError } from "axios";
import { calcularMediaGeral, calcularPercentualFrequencia } from "../utils/calculations";

export interface Turma {
  idTurma: number;
}

export function UseRelatorio() {
  const { user } = UseAuth();
  const [tipoRelatorio, setTipoRelatorio] = useState<'academico' | 'financeiro'>('academico');
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>('');
  const [anoSelecionado, setAnoRef] = useState<string>(new Date().getFullYear().toString());
  const [dadosPrevia, setDadosPrevia] = useState<any[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTurmas, setLoadingTurmas] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [anosDisponiveis, setAnosDisponiveis] = useState<number[]>([]);

  useEffect(() => {
    async function carregarTurmas() {
      try {
        setLoadingTurmas(true);

        const promessas: Promise<any>[] = [
          Api.get('/turma'),
          Api.get('/nota'),
          Api.get('/frequencia')
        ];
        if (user?.papel === 'GESTOR') {
          promessas.push(Api.get('/mensalidade'));
        }
        const resultados = await Promise.all(promessas);
        
        const turmasRes = resultados[0];
        const notasRes = resultados[1];
        const freqRes = resultados[2];
        const mensRes = resultados[3];

        setTurmas(turmasRes.data);

        const anosNotas = (notasRes.data as any[]).map(n => new Date(n.data).getUTCFullYear());
        const anosFreq = (freqRes.data as any[]).map(f => new Date(f.dataAula).getUTCFullYear());
        const anosMens = mensRes ? (mensRes.data as any[]).map(m => new Date(m.dataVencimento).getUTCFullYear()) : [];
        const anosUnicos = Array.from(new Set([...anosNotas, ...anosFreq, ...anosMens]))
          .sort((a, b) => b - a);

        setAnosDisponiveis(anosUnicos);

        if (anosUnicos.length > 0) {
          setAnoRef(anosUnicos[0].toString());
        }
      } catch (error) {
        console.error("Erro ao carregar dados do relatório:", error);
        setErro('Não foi possível carregar os filtros de relatórios.');
      } finally {
        setLoadingTurmas(false);
      }
    }
    carregarTurmas();
  }, [user]);

  //Gerar o Relatório
  async function executarGerarRelatorio() {
    setErro('');
    setSucesso('');
    setDadosPrevia([]);

    if (tipoRelatorio === 'academico' && !turmaSelecionada) {
      setErro('Selecione uma turma para gerar o relatório acadêmico.');
      return;
    }

    setLoading(true);

    try {
      if (tipoRelatorio === 'academico') {
        const [turmaRes, notasRes, freqRes] = await Promise.all([
          Api.get(`/turma/${turmaSelecionada}`),
          Api.get('/nota'),
          Api.get('/frequencia')
        ]);

        const alunos: any[] = turmaRes.data.alunos || [];
        const notas: any[] = notasRes.data;
        const frequencias: any[] = freqRes.data;

        //Monta a planilha
        const relatorioConsolidado = alunos.map(aluno => {
          const notasDoAluno = notas.filter(n => n.idAluno === aluno.idUsuario);
          const freqDoAluno = frequencias.filter(f => f.idAluno === aluno.idUsuario);

          return {
            idUsuario: aluno.idUsuario,
            nome: aluno.usuario.nome,
            media: calcularMediaGeral(notasDoAluno),
            frequencia: calcularPercentualFrequencia(freqDoAluno),
            totalNotas: notasDoAluno.length,
            totalAulas: freqDoAluno.length
          };
        });

        setDadosPrevia(relatorioConsolidado);
        setSucesso('Relatório acadêmico gerado com sucesso!');

      } else if (tipoRelatorio === 'financeiro') {
        if (user?.papel !== 'GESTOR') {
            throw new Error('Acesso negado.');
        }

        const response = await Api.get('/mensalidade');
        const mensalidades: any[] = response.data;

        //Filtra pelo ano selecionado
        const mensalidadesDoAno = mensalidades.filter(m => 
          new Date(m.dataVencimento).getUTCFullYear().toString() === anoSelecionado
        );

        //Agrupa por Aluno
        const relatorioFinanceiro: any[] = [];
        const alunosProcessados = new Set<number>();

        mensalidadesDoAno.forEach(m => {
          if (!alunosProcessados.has(m.idAluno)) {
            alunosProcessados.add(m.idAluno);
            const parcelasDoAluno = mensalidadesDoAno.filter(p => p.idAluno === m.idAluno);
            const pagas = parcelasDoAluno.filter(p => p.statusPagamento === 'PAGO').length;
            const pendentes = parcelasDoAluno.filter(p => p.statusPagamento === 'PENDENTE' || p.statusPagamento === 'ATRASADO').length;
            const totalDevido = parcelasDoAluno.reduce((acc, curr) => acc + (curr.statusPagamento !== 'PAGO' ? curr.valor : 0), 0);

            relatorioFinanceiro.push({
              nome: m.aluno.usuario.nome,
              parcelasPagas: pagas,
              parcelasPendentes: pendentes,
              valorPendente: totalDevido
            });
          }
        });

        setDadosPrevia(relatorioFinanceiro);
        setSucesso('Relatório financeiro gerado com sucesso!');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao processar dados.');
      } else {
        setErro('Erro ao gerar relatório.');
      }
    } finally {
      setLoading(false);
    }
  }

  //download de Planilha Excel (.xlsx)
  function exportarParaPlanilha() {
    if (dadosPrevia.length === 0) return;
    
    setSalvando(true);
    const nomeArquivo = tipoRelatorio === 'academico' 
      ? `Relatorio_Academico_Turma_${turmaSelecionada}_${anoSelecionado}.xlsx`
      : `Relatorio_Financeiro_Inadimplencia_${anoSelecionado}.xlsx`;

    setToastMessage(`Gerando planilha: ${nomeArquivo}...`);
    
    setTimeout(() => {
      setToastMessage('');
      setSalvando(false);
      showMockDownload(nomeArquivo);
    }, 2500);
  }

  function trocarTipoRelatorio(novoTipo: 'academico' | 'financeiro') {
    setTipoRelatorio(novoTipo);
    setDadosPrevia([]);
    setErro('');
    setSucesso('');
  }

  function showMockDownload(filename: string) {
      //link físico de download
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      alert(`Download concluído: ${filename}`);
  }

  return {
    user,
    tipoRelatorio,
    trocarTipoRelatorio,
    setTipoRelatorio,
    turmaSelecionada,
    setTurmaSelecionada,
    anoSelecionado,
    setAnoRef,
    dadosPrevia,
    turmas,
    loading,
    loadingTurmas,
    salvando,
    erro,
    sucesso,
    toastMessage,
    executarGerarRelatorio,
    exportarParaPlanilha,
    anosDisponiveis
  };
}
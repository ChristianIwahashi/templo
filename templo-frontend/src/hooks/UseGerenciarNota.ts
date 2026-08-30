import { useEffect, useState } from "react";
import { UseAuth } from "./UseAuth";
import { Api } from "../api/Api";
import { AxiosError } from "axios";
import type { AutorAuditoria } from "../components/InfoAuditoria";

export interface Turma {
    idTurma: number;
    idProfessor: number;
    alunos?: {
        idUsuario: number;
        usuario: { nome: string };
    }[];
}
export interface Nota {
    idNota: number;
    valor: number;
    tipo: string;
    data: string;
    idAluno: number;
    idProfessor: number;
    criadoEm?: string;
    atualizadoEm?: string;
    criadoPor?: AutorAuditoria | null;
    atualizadoPor?: AutorAuditoria | null;
}

export interface AlunoSelecao {
    idUsuario: number;
    nome: string;
}

export function UseGerenciarNota() {
    const { user } = UseAuth();
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [alunos, setAlunos] = useState<AlunoSelecao[]>([]);
    const [todasNotas, setTodasNotas] = useState<Nota[]>([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState<string>('');
    const [alunoSelecionado, setAlunoSelecionado] = useState<AlunoSelecao | null>(null);
    const [valor, setValor] = useState<string>('');
    const [tipo, setTipo] = useState<string>('');
    const [dataNota, setDataNota] = useState<string>(new Date().toISOString().split('T')[0]);
    const [loadingTurmas, setLoadingTurmas] = useState(true);
    const [loadingAlunos, setLoadingAlunos] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [notaSelecionada, setNotaSelecionada] = useState<Nota | null>(null);

    useEffect(() => {
        async function carregarDadosIniciais() {
            try {
                setLoadingTurmas(true);
                const [turmasRes, notasRes] = await Promise.all([
                    Api.get('/turma'),
                    Api.get('/nota')
                ]);
                setTurmas(turmasRes.data);
                setTodasNotas(notasRes.data);
            } catch (error) {
                console.error(error);
                setErro('Não foi possível carregar os dados iniciais.');
            } finally {
                setLoadingTurmas(false);
            }
        }
        carregarDadosIniciais();
    }, []);

    useEffect(() => {
        if (!turmaSelecionada) {
            setAlunos([]);
            setAlunoSelecionado(null);
            return;
        }

        async function carregarAlunos() {
            try {
                setLoadingAlunos(true);
                setAlunoSelecionado(null);
                const response = await Api.get(`/turma/${turmaSelecionada}`);
                const turmaCompleta: Turma = response.data;

                if (turmaCompleta.alunos) {
                    const lista = turmaCompleta.alunos.map(aluno => ({
                        idUsuario: aluno.idUsuario,
                        nome: aluno.usuario.nome,
                    }));
                    setAlunos(lista);
                }
            } catch (error) {
                console.error(error);
                setErro('Erro ao carregar a lista de alunos.');
            } finally {
                setLoadingAlunos(false);
            }
        }
        carregarAlunos();
    }, [turmaSelecionada]);

    async function atualizarHistoricoDeNotas() {
        try {
            const response = await Api.get('/nota');
            setTodasNotas(response.data);
        } catch (error) {
            console.error("Erro ao atualizar notas:", error);
        }
    }

    //Notas do aluno selecionado
    const notasFiltradasDoAluno = alunoSelecionado
        ? todasNotas.filter(n => n.idAluno === alunoSelecionado.idUsuario)
        : [];

    function abrirModalAdicionar() {
        if (!alunoSelecionado) return;
        setValor('');
        setTipo('');
        setDataNota(new Date().toISOString().split('T')[0]);
        setErro('');
        setSucesso('');
        setIsAddModalOpen(true);
    }

    function abrirModalEditar(nota: Nota) {
        setNotaSelecionada(nota);
        setValor(nota.valor.toString());
        setTipo(nota.tipo);
        setDataNota(new Date(nota.data).toISOString().split('T')[0]);
        setErro('');
        setSucesso('');
        setIsEditModalOpen(true);
    }

    function abrirModalDeletar(nota: Nota) {
        setNotaSelecionada(nota);
        setErro('');
        setSucesso('');
        setIsDeleteModalOpen(true);
    }

    //POST nota
    async function executarAdicionarNota() {
        if (!alunoSelecionado || !user) return;
        const notaNum = parseFloat(valor);

        if (isNaN(notaNum) || notaNum < 0 || notaNum > 10) {
            setErro('A nota deve ser um número entre 0 e 10.');
            return;
        }
        if (!tipo.trim()) {
            setErro('O tipo de avaliação é obrigatório.');
            return;
        }

        setSalvando(true);
        setErro('');

        const turmaAtual = turmas.find(t => t.idTurma.toString() === turmaSelecionada);
        const professorId = (user?.papel === 'GESTOR' ? turmaAtual?.idProfessor : user?.idUsuario) || turmaAtual?.idProfessor;''
        try {
            await Api.post('/nota', {
                valor: notaNum,
                tipo: tipo,
                data: dataNota,
                idProfessor: professorId,
                idAluno: alunoSelecionado.idUsuario
            });

            setSucesso('Nota lançada com sucesso!');
            await atualizarHistoricoDeNotas();
            setIsAddModalOpen(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                setErro(error.response?.data?.message || 'Erro ao lançar nota.');
            } else {
                setErro('Erro inesperado.');
            }
        } finally {
            setSalvando(false);
        }
    }

    //PUT nota
    async function executarEditarNota() {
        if (!notaSelecionada) return;
        const notaNum = parseFloat(valor);

        if (isNaN(notaNum) || notaNum < 0 || notaNum > 10) {
            setErro('A nota deve ser um número entre 0 e 10.');
            return;
        }

        setSalvando(true);
        setErro('');

        try {
            await Api.put(`/nota/${notaSelecionada.idNota}`, {
                valor: notaNum,
                tipo: tipo,
                data: dataNota
            });

            setSucesso('Nota atualizada com sucesso!');
            await atualizarHistoricoDeNotas();
            setIsEditModalOpen(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                setErro(error.response?.data?.message || 'Erro ao atualizar nota.');
            } else {
                setErro('Erro inesperado.');
            }
        } finally {
            setSalvando(false);
        }
    }

    //DELETE nota
    async function executarDeletarNota() {
        if (!notaSelecionada) return;

        setSalvando(true);
        setErro('');

        try {
            await Api.delete(`/nota/${notaSelecionada.idNota}`);
            setSucesso('Nota excluída com sucesso!');
            await atualizarHistoricoDeNotas();
            setIsDeleteModalOpen(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                setErro(error.response?.data?.message || 'Erro ao excluir nota.');
            } else {
                setErro('Erro inesperado.');
            }
        } finally {
            setSalvando(false);
        }
    }

    return {
        turmas,
        alunos,
        turmaSelecionada,
        setTurmaSelecionada,
        alunoSelecionado,
        setAlunoSelecionado,
        notasFiltradasDoAluno,
        valor,
        setValor,
        tipo,
        setTipo,
        dataNota,
        setDataNota,
        loadingTurmas,
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
        notaSelecionada,
        abrirModalAdicionar,
        abrirModalEditar,
        abrirModalDeletar,
        executarAdicionarNota,
        executarEditarNota,
        executarDeletarNota,
        setErro,
        setSucesso
    };
}
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
    criadoEm?: string;
    atualizadoEm?: string;
    criadoPor?: AutorAuditoria | null;
    atualizadoPor?: AutorAuditoria | null;
}
export interface AlunoChamada {
    idUsuario: number;
    nome: string;
    presente: boolean;
    idFrequencia: number | null;
}

export function UseGerenciarChamada() {
    const { user } = UseAuth();
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [alunos, setAlunos] = useState<AlunoChamada[]>([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState<string>('');
    const [dataAula, setDataAula] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [loadingTurmas, setLoadingTurmas] = useState(true);
    const [loadingAlunos, setLoadingAlunos] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [isConfirmSalvarOpen, setIsConfirmSalvarOpen] = useState(false);
    const [isConfirmDeletarOpen, setIsConfirmDeletarOpen] = useState(false);

    useEffect(() => {
        async function carregarTurmas() {
            try {
                setLoadingTurmas(true);
                const response = await Api.get('/turma');
                setTurmas(response.data);
            } catch (error) {
                console.error(error);
                setErro('Não foi possível carregar suas turmas.');
            } finally {
                setLoadingTurmas(false);
            }
        }
        carregarTurmas();
    }, []);

    useEffect(() => {
        if (!turmaSelecionada) {
            setAlunos([]);
            return;
        }

        async function carregarAlunosHistorico() {
            try {
                setLoadingAlunos(true);
                setErro('');
                setSucesso('');

                const [turmaResponse, frequenciasResponse] = await Promise.all([
                    Api.get(`/turma/${turmaSelecionada}`),
                    Api.get('/frequencia')
                ]);

                const turmaCompleta: Turma = turmaResponse.data;
                const todasChamadas: any[] = frequenciasResponse.data;

                if (turmaCompleta.alunos) {
                    const listaFormatada = turmaCompleta.alunos.map(aluno => {
                        const chamadaExistente = todasChamadas.find(c => {
                            const dataBancoFormatada = new Date(c.dataAula).toISOString().split('T')[0];
                            return c.idAluno === aluno.idUsuario && dataBancoFormatada === dataAula;
                        });

                        return {
                            idUsuario: aluno.idUsuario,
                            nome: aluno.usuario.nome,
                            presente: chamadaExistente ? chamadaExistente.presenca : true,
                            idFrequencia: chamadaExistente ? chamadaExistente.idFrequencia : null
                        };
                    });

                    setAlunos(listaFormatada);
                }
            } catch (error) {
                console.error(error);
                setErro('Erro ao carregar a lista de chamada para esta data.');
            } finally {
                setLoadingAlunos(false);
            }
        }

        carregarAlunosHistorico();
    }, [turmaSelecionada, dataAula]);

    //Alternar presença
    function handleAlternarPresenca(idUsuario: number) {
        setAlunos(prevAlunos =>
            prevAlunos.map(aluno =>
                aluno.idUsuario === idUsuario
                    ? { ...aluno, presente: !aluno.presente }
                    : aluno
            )
        );
    }

    //Presença
    function handleMarcarTodos() {
        setAlunos(prevAlunos => prevAlunos.map(a => ({ ...a, presente: true })));
    }

    //Falta
    function handleDesmarcarTodos() {
        setAlunos(prevAlunos => prevAlunos.map(a => ({ ...a, presente: false })));
    }

    //Salvar
    async function handleSalvarChamada() {
        if (!turmaSelecionada || !dataAula) {
            setErro('Selecione a turma e a data da aula.');
            return;
        }
        setIsConfirmSalvarOpen(true);
    }

    //Executa o POST ou PUT
    async function executarSalvarChamada() {
        setIsConfirmSalvarOpen(false);
        setSalvando(true);
        setErro('');
        setSucesso('');

        const turmaAtual = turmas.find(t => t.idTurma.toString() === turmaSelecionada);
        const professorId = (user?.papel === 'GESTOR' ? turmaAtual?.idProfessor : user?.idUsuario) || turmaAtual?.idProfessor;

        try {
            await Promise.all(
                alunos.map(aluno => {
                    if (aluno.idFrequencia) {
                        return Api.put(`/frequencia/${aluno.idFrequencia}`, {
                            dataAula: dataAula,
                            presenca: aluno.presente
                        });
                    } else {
                        return Api.post('/frequencia', {
                            dataAula: dataAula,
                            presenca: aluno.presente,
                            idProfessor: professorId,
                            idAluno: aluno.idUsuario
                        });
                    }
                })
            );

            setSucesso('Lista de chamada atualizada com sucesso!');

            const responseFrequencias = await Api.get('/frequencia');
            const todasChamadas = responseFrequencias.data;
            setAlunos((prev: AlunoChamada[]) => prev.map((aluno: AlunoChamada) => {
                const correspondente = todasChamadas.find((c: any) => {
                    const dataBanco = new Date(c.dataAula).toISOString().split('T')[0];
                    return c.idAluno === aluno.idUsuario && dataBanco === dataAula;
                });
                return {
                    ...aluno,
                    idFrequencia: correspondente ? correspondente.idFrequencia : null
                }
            }));
        } catch (error) {
            if (error instanceof AxiosError) {
                setErro(error.response?.data?.message || 'Erro ao salvar chamada.');
            } else {
                setErro('Erro inesperado ao salvar.');
            }
        } finally {
            setSalvando(false);
        }
    }

    //Exclusão
    async function executarDeletarChamada() {
        setIsConfirmDeletarOpen(false);
        setSalvando(true);
        setErro('');
        setSucesso('');

        try {
            const chamadasSalvas = alunos.filter(aluno => aluno.idFrequencia !== null);
            await Promise.all(
                chamadasSalvas.map(aluno => Api.delete(`/frequencia/${aluno.idFrequencia}`))
            );

            setSucesso('A lista de chamado foi deletada com sucesso!');
            setAlunos(prev => prev.map(aluno => ({
                ...aluno,
                presente: true,
                idFrequencia: null
            })));

        } catch (error) {
            if (error instanceof AxiosError) {
                setErro(error.response?.data?.message || 'Erro ao apagar chamada.');
            } else {
                setErro('Erro inesperado ao apagar.');
            }
        } finally {
            setSalvando(false);
        }
    }

    //Verifica chamada salva no dia
    const temChamadaSalvaNoDia = alunos.some(aluno => aluno.idFrequencia !== null);

    return {
        turmas,
        alunos,
        turmaSelecionada,
        setTurmaSelecionada,
        dataAula,
        setDataAula,
        loadingTurmas,
        loadingAlunos,
        salvando,
        erro,
        sucesso,
        isConfirmSalvarOpen,
        setIsConfirmSalvarOpen,
        isConfirmDeletarOpen,
        setIsConfirmDeletarOpen,
        temChamadaSalvaNoDia,
        handleAlternarPresenca,
        handleMarcarTodos,
        handleDesmarcarTodos,
        handleSalvarChamada,
        executarSalvarChamada,
        executarDeletarChamada
    };
}

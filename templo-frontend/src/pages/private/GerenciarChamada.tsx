import { useEffect, useState } from "react";
import { Api } from "../../api/Api";
import { UseAuth } from "../../hooks/UseAuth";
import { Users, Check, Info, AlertCircle, CheckSquare, Square } from "lucide-react";
import { AxiosError } from "axios";

interface Turma {
    idTurma: number;
    alunos?: {
        idUsuario: number;
        usuario: { nome: string };
    }[];
}

interface AlunoChamada {
    idUsuario: number;
    nome: string;
    presente: boolean;
}

export function GerenciarChamada() {
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

        async function carregarAlunosDaTurma() {
            try {
                setLoadingAlunos(true);
                setErro('');
                setSucesso('');

                const response = await Api.get(`/turma/${turmaSelecionada}`);
                const turmaCompleta: Turma = response.data;

                if (turmaCompleta.alunos) {
                    const listaInicial = turmaCompleta.alunos.map(aluno => ({
                        idUsuario: aluno.idUsuario,
                        nome: aluno.usuario.nome,
                        presente: true
                    }));
                    setAlunos(listaInicial);
                }
            } catch (error) {
                console.error(error);
                setErro('Erro ao carregar a lista de alunos desta turma.');
            } finally {
                setLoadingAlunos(false);
            }
        }

        carregarAlunosDaTurma();
    }, [turmaSelecionada]);

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

        setSalvando(true);
        setErro('');
        setSucesso('');

        try {
            await Promise.all(
                alunos.map(aluno =>
                    Api.post('/frequencia', {
                        dataAula: dataAula,
                        presenca: aluno.presente,
                        idProfessor: user?.idUsuario,
                        idAluno: aluno.idUsuario
                    })
                )
            );

            setSucesso('Registro de chamada salvo com sucesso!');
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

    if (loadingTurmas) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500 font-medium animate-pulse">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-sys-blue" />
                <h2 className="text-2xl font-bold text-gray-800">Gerenciar Chamada</h2>
            </div>

            {/*Filtros*/}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="select-turma" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 items-center gap-1.5">
                        Selecione a Turma
                    </label>
                    <select
                        id="select-turma"
                        value={turmaSelecionada}
                        onChange={e => setTurmaSelecionada(e.target.value)}
                        className="w-full p-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 cursor-pointer font-medium"
                    >
                        <option value="">Selecione uma turma</option>
                        {turmas.map(t => (
                            <option key={t.idTurma} value={t.idTurma}>Turma {t.idTurma}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="data-aula" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 items-center gap-1.5">
                        Data da Aula
                    </label>
                    <input
                        id="data-aula"
                        type="date"
                        value={dataAula}
                        onChange={e => setDataAula(e.target.value)}
                        disabled={salvando}
                        className="w-full p-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 font-medium"
                    />
                </div>
            </div>

            {/*Lista de Alunos*/}
            {turmaSelecionada && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    {/*Cabeçalho*/}
                    <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                        <h4 className="font-bold text-gray-700">Lista de Alunos</h4>

                        {alunos.length > 0 && !loadingAlunos && (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleMarcarTodos}
                                    className="px-3 py-1.5 bg-blue-50 text-sys-blue hover:bg-sys-blue hover:text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                                >
                                    Marcar Todos Presentes
                                </button>
                                <button
                                    onClick={handleDesmarcarTodos}
                                    className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                                >
                                    Marcar Todos Faltas
                                </button>
                            </div>
                        )}
                    </div>

                    {/*Avisos*/}
                    {erro && (
                        <div className="p-4 bg-red-50 text-red-600 border-b border-red-150 flex items-center gap-2 font-semibold">
                            <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
                        </div>
                    )}
                    {sucesso && (
                        <div className="p-4 bg-green-50 text-green-700 border-b border-green-150 flex items-center gap-2 font-semibold">
                            <Check className="w-4 h-4 shrink-0" /> {sucesso}
                        </div>
                    )}

                    {loadingAlunos ? (
                        <div className="p-8 text-center text-gray-500 font-medium animate-pulse">
                            Carregando...
                        </div>
                    ) : alunos.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 font-medium">
                            <Info className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            Nenhum aluno matriculado nesta turma ainda.
                        </div>
                    ) : (
                        <>
                            {/*Lista*/}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-150 text-sm text-gray-600 bg-gray-50/20">
                                            <th className="p-4 font-semibold text-center w-20">Presença</th>
                                            <th className="p-4 font-semibold">Nome do Aluno</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {alunos.map((aluno) => (
                                            <tr
                                                key={aluno.idUsuario}
                                                onClick={() => handleAlternarPresenca(aluno.idUsuario)}
                                                className="border-b border-gray-100 hover:bg-gray-50/30 transition-colors cursor-pointer"
                                            >
                                                {/*Checkbox*/}
                                                <td className="p-4 text-center">
                                                    <div className="flex justify-center">
                                                        {aluno.presente ? (
                                                            <CheckSquare className="w-6 h-6 text-green-600 shrink-0" />
                                                        ) : (
                                                            <Square className="w-6 h-6 text-red-400 shrink-0" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="font-semibold text-gray-800 block">{aluno.nome}</span>
                                                    <span className="text-xs text-gray-400 font-medium mt-1 block">ID do Estudante: {aluno.idUsuario}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/*Salvar Chamada*/}
                            <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={handleSalvarChamada}
                                    disabled={salvando}
                                    className="bg-sys-blue hover:bg-sys-blue-hover text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-100 cursor-pointer disabled:opacity-50"
                                >
                                    {salvando ? 'Salvando Chamada...' : 'Confirmar e Salvar Chamada'}
                                </button>
                            </div>
                        </>
                    )}

                </div>
            )}

        </div>
    );
}
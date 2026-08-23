import { UseGerenciarChamada } from "../../hooks/UseGerenciarChamada";
import type { Turma, AlunoChamada } from "../../hooks/UseGerenciarChamada"; 
import { Users, Check, Info, AlertCircle, CheckSquare, Square, AlertTriangle } from "lucide-react";

export function GerenciarChamada() {
    const {
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
    } = UseGerenciarChamada();

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
                        {turmas.map((t: Turma) => (
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
                                        {alunos.map((aluno: AlunoChamada) => (
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
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/*Salvar Chamada*/}
                            <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center flex-wrap gap-4">

                                {/*Botão*/}
                                {temChamadaSalvaNoDia ? (
                                    <button
                                        onClick={() => setIsConfirmDeletarOpen(true)}
                                        disabled={salvando}
                                        className="bg-sys-blue hover:bg-sys-blue-hover text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-100 cursor-pointer"
                                    >
                                        Apagar Chamada deste Dia
                                    </button>
                                ) : (
                                    <div className="hidden sm:block"></div>
                                )}

                                <button
                                    onClick={handleSalvarChamada}
                                    disabled={salvando}
                                    className="flex-1 py-2.5 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl text-sm font-bold transition cursor-pointer"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </>
                    )}

                </div>
            )}

            {/*Confirmar Salvar*/}
            {isConfirmSalvarOpen && (
                <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs transition-opacity">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6 text-center border border-gray-100 animate-modal-enter">
                        <div className="w-12 h-12 bg-blue-50 text-sys-blue rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Salvar Diário de Classe</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Deseja realmente salvar a chamada da turma selecionada para o dia {new Date(dataAula + 'T00:00:00').toLocaleDateString('pt-BR')}?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsConfirmSalvarOpen(false)}
                                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={executarSalvarChamada}
                                className="flex-1 py-2.5 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl text-sm font-bold transition cursor-pointer"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/*Confirmar Exclusão*/}
            {isConfirmDeletarOpen && (
                <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs transition-opacity">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6 text-center border border-gray-150 animate-modal-enter">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-red-600 mb-2">Apagar Chamada</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Você tem certeza de que deseja apagar TODA a presença/falta registrada no dia {new Date(dataAula + 'T00:00:00').toLocaleDateString('pt-BR')}? Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsConfirmDeletarOpen(false)}
                                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={executarDeletarChamada}
                                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition cursor-pointer"
                            >
                                Sim, Apagar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

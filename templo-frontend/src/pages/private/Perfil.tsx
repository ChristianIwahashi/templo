import { useEffect, useState, type SyntheticEvent } from "react";
import { UseAuth } from "../../hooks/UseAuth";
import { Api } from "../../api/Api";
import { User, Eye, EyeOff, CheckCircle2, AlertCircle, FileEdit } from "lucide-react";
import { AxiosError } from "axios";

const padraoTelefone = (value: string) => {
    const apenasNumeros = value.replace(/\D/g, "");
    const numeroLimitado = apenasNumeros.slice(0, 11);

    if (numeroLimitado.length <= 2) {
        return numeroLimitado.replace(/^(\d{0,2})/, "($1");
    }
    if (numeroLimitado.length <= 6) {
        return numeroLimitado.replace(/^(\d{2})(\d{0,4})/, "($1) $2");
    }
    if (numeroLimitado.length <= 10) {
        return numeroLimitado.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    }
    return numeroLimitado.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

const regexTextoSeguro = /^(?=.*[a-zA-Z0-9À-ÿ])[a-zA-Z0-9À-ÿ\s.!?,;\-_@()]+$/;

interface PerfilData {
    idUsuario: number;
    nome: string;
    email: string;
    telefone: string;
    papel: string;
    aluno?: {
        dataNascimento: string;
    }
}

export function Perfil() {
    const { user } = UseAuth();
    const [perfil, setPerfil] = useState<PerfilData | null>(null);
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senhaAntiga, setSenhaAntiga] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [showSenhaAntiga, setShowSenhaAntiga] = useState(false);
    const [showSenha, setShowSenha] = useState(false);
    const [showConfirmar, setShowConfirmar] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    useEffect(() => {
        async function carregarPerfilCompleto() {
            if (!user) return;
            try {
                setLoading(true);
                const response = await Api.get(`/usuario/${user.idUsuario}`);
                setPerfil(response.data);
                setTelefone(padraoTelefone(response.data.telefone));
            } catch (error) {
                console.error(error);
                setErro('Não foi possível carregar as informações do seu perfil.');
            } finally {
                setLoading(false);
            }
        }

        carregarPerfilCompleto();
    }, [user]);

    function handlePrepararSalvar(e: SyntheticEvent) {
        e.preventDefault();
        setErro('');
        setSucesso('');

        if (!senhaAntiga) {
            setErro('Você precisa informar sua senha atual para confirmar as alterações.');
            return;
        }

        const digitosTelefone = telefone.replace(/\D/g, "").length;

        if (digitosTelefone > 0 && digitosTelefone < 10) {
            setErro('O telefone informado está incompleto. Digite o DDD + 8 ou 9 números.');
            return;
        }

        if (novaSenha) {
            if (novaSenha.length < 6) {
                setErro('A nova senha deve ter pelo menos 6 caracteres.');
                return;
            }

            if (!regexTextoSeguro.test(novaSenha)) {
                setErro('A nova senha contém caracteres inválidos. Use apenas letras, números e caracteres especiais (!, ., #, @, etc.)');
                return;
            }

            if (novaSenha !== confirmarSenha) {
                setErro('A nova senha e a confirmação não coincidem.');
                return;
            }
        }

        setIsConfirmModalOpen(true);
    }

    //Chama a API
    async function executarSalvarPerfil() {
        setIsConfirmModalOpen(false); // Fecha o modal
        setSalvando(true);

        try {
            await Api.patch('/usuario/meu-perfil', {
                senhaAntiga: senhaAntiga,
                telefone: telefone,
                senha: novaSenha || undefined
            });

            setSucesso('Perfil atualizado com sucesso!');
            setSenhaAntiga('');
            setNovaSenha('');
            setConfirmarSenha('');
        } catch (error) {
            if (error instanceof AxiosError) {
                setErro(error.response?.data?.message || 'Erro ao atualizar dados do perfil.');
            } else {
                setErro('Ocorreu um erro inesperado.');
            }
        } finally {
            setSalvando(false);
        }
    }

    function formatarData(dataStr: string) {
        return new Date(dataStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500 font-medium animate-pulse">Carregando...</p>
            </div>
        );
    }

    if (erro && !perfil) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 font-semibold text-center">
                    {erro}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6 animate-fade-in-up relative">

            <div className="flex items-center gap-2">
                <User className="w-6 h-6 text-sys-blue" />
                <h2 className="text-2xl font-bold text-gray-800">Meus Dados Cadastrais</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

                <div className="flex items-center gap-6 mb-8 border-gray-200 pb-6">
                    <div className="w-24 h-24 bg-blue-100 text-sys-blue rounded-full flex items-center justify-center text-3xl font-bold uppercase shrink-0">
                        {perfil?.nome.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 leading-tight">{perfil?.nome}</h3>
                        <span className="inline-block mt-2 bg-blue-50 text-sys-blue border border-blue-200 text-xs px-2.5 py-1 rounded-full font-bold tracking-wide uppercase">
                            {perfil?.papel}
                        </span>
                    </div>
                </div>

                {/*Forms*/}
                <form onSubmit={handlePrepararSalvar} className="space-y-6">

                    {erro && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200 flex items-center gap-2 font-medium">
                            <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
                        </div>
                    )}
                    {sucesso && (
                        <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm border border-green-200 flex items-center gap-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 shrink-0" /> {sucesso}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/*E-mail*/}
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 items-center gap-1.5">
                                E-mail (Login)
                            </label>
                            <input
                                type="text"
                                disabled
                                value={perfil?.email}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed outline-none text-sm"
                            />
                        </div>

                        {/*Data de Nascimento */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 items-center gap-1.5">
                                Data de Nascimento
                            </label>
                            <input
                                type="text"
                                disabled
                                value={perfil?.aluno?.dataNascimento ? formatarData(perfil.aluno.dataNascimento) : "-"}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed outline-none text-sm"
                            />
                        </div>

                        {/*Telefone*/}
                        <div>
                            <label htmlFor="telefone" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 items-center gap-1.5">
                                Telefone / Celular
                            </label>
                            <input
                                id="telefone"
                                type="text"
                                value={telefone}
                                onChange={e => setTelefone(padraoTelefone(e.target.value))}
                                disabled={salvando}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 text-sm transition-all"
                                placeholder="(00) 00000-0000"
                            />
                        </div>

                        <div className="hidden md:block"></div>

                        {/*Nova Senha*/}
                        <div>
                            <label htmlFor="nova-senha" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Nova Senha (Mín. 6 dígitos)
                            </label>
                            <div className="relative">
                                <input
                                    id="nova-senha"
                                    type={showSenha ? "text" : "password"}
                                    value={novaSenha}
                                    onChange={e => setNovaSenha(e.target.value)}
                                    disabled={salvando}
                                    placeholder="Deixe em branco para manter a atual"
                                    className="w-full px-4 pr-10 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 text-sm transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSenha(!showSenha)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-sys-blue cursor-pointer"
                                >
                                    {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/*Confirmar Senha*/}
                        <div>
                            <label htmlFor="confirmar-senha" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Confirmar Nova Senha
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmar-senha"
                                    type={showConfirmar ? "text" : "password"}
                                    value={confirmarSenha}
                                    onChange={e => setConfirmarSenha(e.target.value)}
                                    disabled={salvando}
                                    placeholder="Confirme sua nova senha"
                                    className="w-full px-4 pr-10 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 text-sm transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmar(!showConfirmar)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-sys-blue cursor-pointer"
                                >
                                    {showConfirmar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/*Senha Atual*/}

                        <div className="relative">
                            <label htmlFor="senha-antiga" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Confirmar Senha Atual *
                            </label>
                            <div className="relative">
                                <input
                                    id="senha-antiga"
                                    type={showSenhaAntiga ? "text" : "password"}
                                    value={senhaAntiga}
                                    onChange={e => setSenhaAntiga(e.target.value)}
                                    disabled={salvando}
                                    placeholder="Digite sua senha ATUAL para salvar"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 text-sm transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSenhaAntiga(!showSenhaAntiga)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500 cursor-pointer"
                                >
                                    {showSenhaAntiga ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-1.5 italic">
                                * Digite a sua senha atual.
                            </p>
                        </div>
                    </div>

                    {/*Salvar*/}
                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={salvando}
                            className="bg-sys-blue hover:bg-sys-blue-hover text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {salvando ? 'Salvando Alterações...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>

            {/*Confirmar alterações*/}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-250 flex items-center justify-center p-4 backdrop-blur-xs transition-opacity">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6 text-center border border-gray-100 animate-modal-enter">
                        <div className="w-12 h-12 bg-blue-50 text-sys-blue rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileEdit className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Salvar Alterações</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Você tem certeza de que deseja atualizar seus dados cadastrais?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsConfirmModalOpen(false)}
                                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={executarSalvarPerfil}
                                className="flex-1 py-2.5 bg-sys-blue hover:bg-sys-blue-hover text-white rounded-xl text-sm font-bold transition cursor-pointer"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
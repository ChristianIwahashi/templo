import { useEffect, useState, type FormEvent } from "react";
import { UseAuth } from "../../hooks/UseAuth";
import { Api } from "../../api/Api";
import { formatarData } from "../../utils/formatters";
import { padraoTelefone } from "../../utils/telefone";
import { validarSenhaForte, regexTextoSeguro } from "../../utils/validator";
import { ConfirmModal } from "../../components/ConfirmModal";
import { User, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { AxiosError } from "axios";

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
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    async function carregarPerfilCompleto() {
      if (!user) return;
      try {
        setLoading(true);
        const response = await Api.get(`/usuario/${user.idUsuario}`);
        setPerfil(response.data);
        setTelefone(padraoTelefone(response.data.telefone || ''));
      } catch (error) {
        console.error(error);
        setErro('Não foi possível carregar as informações do seu perfil.');
      } finally {
        setLoading(false);
      }
    }
    carregarPerfilCompleto();
  }, [user]);

  function handlePrepararSalvar(e: FormEvent) {
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
      if (!validarSenhaForte(novaSenha)) {
        setErro('A nova senha deve ter no mínimo 6 caracteres, contendo letras maiúsculas, minúsculas, números e caracteres especiais.');
        return;
      }
      if (!regexTextoSeguro.test(novaSenha)) {
        setErro('A nova senha contém caracteres inválidos.');
        return;
      }
      if (novaSenha !== confirmarSenha) {
        setErro('A nova senha e a confirmação não coincidem.');
        return;
      }
    }
    setIsConfirmModalOpen(true);
  }

  async function executarSalvarPerfil() {
    setIsConfirmModalOpen(false);
    setSalvando(true);
    setErro('');
    setSucesso('');

    try {
      await Api.patch('/usuario/meu-perfil', {
        senhaAntiga,
        telefone,
        senha: novaSenha || undefined
      });

      setSucesso('Perfil e credenciais atualizados com sucesso!');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-slate-400 font-medium animate-pulse">Carregando dados do perfil...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 animate-fade-in-up text-slate-800 dark:text-slate-100">
      
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 pb-4">
        <User className="w-6 h-6 text-sys-blue" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Meu Perfil</h2>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-150 dark:border-slate-800 p-6 md:p-8">
        
        {/*Identificação de Perfil*/}
        <div className="flex items-center gap-6 mb-8 border-b border-gray-100 dark:border-slate-800 pb-6">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-950/60 text-sys-blue rounded-full flex items-center justify-center text-3xl font-bold uppercase shrink-0">
            {perfil?.nome.charAt(0)}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-slate-100 leading-tight">{perfil?.nome}</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Identificação #{perfil?.idUsuario}</p>
            <span className="inline-block mt-2 bg-blue-50 dark:bg-blue-950/60 text-sys-blue border border-blue-200 dark:border-blue-900 text-xs px-2.5 py-1 rounded-full font-bold tracking-wide uppercase">
              {perfil?.papel}
            </span>
          </div>
        </div>

        {/*Formulário*/}
        <form onSubmit={handlePrepararSalvar} className="space-y-6">
          
          {erro && (
            <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 p-3 rounded-lg text-sm border border-red-200 dark:border-red-900 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
            </div>
          )}
          {sucesso && (
            <div className="bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 p-3 rounded-lg text-sm border border-green-200 dark:border-green-900 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> {sucesso}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/*E-mail*/}
            <div>
              <label className="block text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 items-center gap-1.5">
                E-mail (Login)
              </label>
              <input
                type="text"
                disabled
                value={perfil?.email || ''}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-100 dark:bg-slate-800/60 text-gray-500 dark:text-slate-400 cursor-not-allowed outline-none text-sm"
              />
            </div>

            {/*Telefone*/}
            <div>
              <label htmlFor="telefone-perfil" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 items-center gap-1.5">
                Telefone / Celular
              </label>
              <input
                id="telefone-perfil"
                type="text"
                value={telefone}
                onChange={e => setTelefone(padraoTelefone(e.target.value))}
                disabled={salvando}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm transition-all"
                placeholder="(00) 00000-0000"
              />
            </div>

            {/*Data de Nascimento*/}
            {user?.papel === 'ALUNO' && (
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 items-center gap-1.5">
                  Data de Nascimento
                </label>
                <input
                  type="text"
                  disabled
                  value={perfil?.aluno?.dataNascimento ? formatarData(perfil.aluno.dataNascimento) : "-"}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-100 dark:bg-slate-800/60 text-gray-500 dark:text-slate-400 cursor-not-allowed outline-none text-sm"
                />
              </div>
            )}

            {/*Divisória*/}
            <div className="col-span-1 md:col-span-2 pt-4 border-t border-gray-100 dark:border-slate-800">
              <h4 className="font-bold text-gray-700 dark:text-slate-200 text-sm flex items-center gap-1.5 mb-1">
                Segurança e Senha de Acesso
              </h4>
              <p className="text-xs text-gray-400 dark:text-slate-400">Preencha apenas caso deseje redefinir a sua senha de acesso.</p>
            </div>

            {/*Senha Atual*/}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="senha-antiga" className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Senha Atual * (Necessária para confirmar alterações)
              </label>
              <div className="relative">
                <input
                  id="senha-antiga"
                  type={showSenhaAntiga ? "text" : "password"}
                  value={senhaAntiga}
                  onChange={e => setSenhaAntiga(e.target.value)}
                  disabled={salvando}
                  placeholder="Digite sua senha atual"
                  className="w-full px-4 pr-10 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSenhaAntiga(!showSenhaAntiga)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-sys-blue cursor-pointer"
                >
                  {showSenhaAntiga ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/*Nova Senha*/}
            <div>
              <label htmlFor="nova-senha" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  id="nova-senha"
                  type={showNovaSenha ? "text" : "password"}
                  value={novaSenha}
                  onChange={e => setNovaSenha(e.target.value)}
                  disabled={salvando}
                  placeholder="Deixe em branco para não alterar"
                  className="w-full px-4 pr-10 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNovaSenha(!showNovaSenha)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-sys-blue cursor-pointer"
                >
                  {showNovaSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/*Confirmar Nova Senha*/}
            <div>
              <label htmlFor="confirmar-senha" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
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
                  className="w-full px-4 pr-10 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm transition-all"
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

          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={salvando}
              className="bg-sys-blue hover:bg-sys-blue-hover text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-100 dark:shadow-none flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              {salvando ? 'Salvando Alterações...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>

      <ConfirmModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={executarSalvarPerfil}
        title="Confirmar Atualização de Perfil"
        description="Deseja confirmar as alterações no seu telefone de contato e/ou credenciais de acesso?"
        type="info"
        isLoading={salvando}
      />
    </div>
  );
}
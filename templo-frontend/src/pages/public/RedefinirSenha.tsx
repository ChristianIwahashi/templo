import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Api } from "../../api/api";
import { useTheme } from "../../contexts/ThemeContext";
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ArrowLeft, Sun, Moon } from "lucide-react";
import { AxiosError } from "axios";

export function RedefinirSenha() {
  const { theme, toggleTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  async function handleRedefinir(e: FormEvent) {
    e.preventDefault();
    if (!token) {
      setErro('Token de recuperação inválido ou ausente na URL.');
      return;
    }
    if (!novaSenha || !confirmarSenha) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (novaSenha.length < 6) {
      setErro('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    setErro('');
    setSucesso('');

    try {
      const response = await Api.post('/auth/redefinir-senha', {
        token,
        novaSenha
      });
      setSucesso(response.data.message || 'Senha alterada com sucesso!');

      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Token inválido ou expirado.');
      } else {
        setErro('Ocorreu um erro ao redefinir a senha.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950 p-4 font-sans transition-colors">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4 border border-gray-100 dark:border-slate-800">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">Link Inválido</h2>
          <p className="text-sm text-gray-600 dark:text-slate-400">O link de recuperação de senha está incompleto ou expirou.</p>
          <Link to="/login" className="inline-block bg-sys-blue text-white px-5 py-2.5 rounded-xl font-bold text-sm">
            Ir para o Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 p-4 transition-colors relative font-sans">

      {/*Botão de alternar tema*/}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:text-sys-blue dark:hover:text-sys-blue shadow-md border border-gray-150 dark:border-slate-700 transition-all cursor-pointer"
          title={theme === 'dark' ? "Mudar para modo claro" : "Mudar para modo escuro"}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100 dark:border-slate-800 transition-colors">
        
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100">
            Nova Senha
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
            Digite e confirme sua nova senha de acesso abaixo.
          </p>
        </div>

        <form onSubmit={handleRedefinir} className="space-y-5" noValidate>
          
          {erro && (
            <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 p-3 rounded-xl text-sm border border-red-200 dark:border-red-900 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
            </div>
          )}

          {sucesso && (
            <div className="bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 p-3 rounded-xl text-sm border border-green-200 dark:border-green-900 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> {sucesso} Redirecionando...
            </div>
          )}

          {/*Nova Senha*/}
          <div>
            <label htmlFor="nova-senha" className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Nova Senha (Mín. 6 caracteres)
            </label>
            <div className="relative">
              <input
                id="nova-senha"
                type={showSenha ? "text" : "password"}
                value={novaSenha}
                onChange={e => setNovaSenha(e.target.value)}
                disabled={loading || !!sucesso}
                required
                className="w-full pl-4 pr-10 py-2.5 border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sys-blue focus:border-sys-blue transition outline-none bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 text-sm disabled:opacity-50"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-slate-500 hover:text-sys-blue cursor-pointer"
              >
                {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/*Confirmar Nova Senha*/}
          <div>
            <label htmlFor="confirmar-senha" className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <input
                id="confirmar-senha"
                type={showConfirmar ? "text" : "password"}
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                disabled={loading || !!sucesso}
                required
                className="w-full pl-4 pr-10 py-2.5 border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sys-blue focus:border-sys-blue transition outline-none bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 text-sm disabled:opacity-50"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmar(!showConfirmar)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-slate-500 hover:text-sys-blue cursor-pointer"
              >
                {showConfirmar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!sucesso}
            className="w-full py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-sys-blue hover:bg-sys-blue-hover transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Salvando nova senha...
              </>
            ) : (
              'Atualizar Senha'
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-100 dark:border-slate-800">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-slate-400 hover:text-sys-blue dark:hover:text-sys-blue transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Voltar para o login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
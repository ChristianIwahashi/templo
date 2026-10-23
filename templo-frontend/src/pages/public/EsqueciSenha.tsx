import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Api } from "../../api/api";
import { useTheme } from "../../contexts/ThemeContext";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2, Sun, Moon } from "lucide-react";
import { AxiosError } from "axios";

export function EsqueciSenha() {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  async function handleEnviarEmail(e: FormEvent) {
    e.preventDefault();
    if (!email) {
      setErro('Por favor, informe o seu e-mail.');
      return;
    }
    setLoading(true);
    setErro('');
    setSucesso('');

    try {
      const response = await Api.post('/auth/esqueci-senha', { email });
      setSucesso(response.data.message || 'Se o e-mail for válido, as instruções foram enviadas.');
      setEmail('');
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro ao solicitar recuperação de senha.');
      } else {
        setErro('Ocorreu um erro inesperado.');
      }
    } finally {
      setLoading(false);
    }
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
        
        {/*Cabeçalho*/}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100">
            Recuperar Senha
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
            Digite seu e-mail cadastrado e enviaremos um link seguro para você redefinir sua senha.
          </p>
        </div>

        {/*Formulário*/}
        <form onSubmit={handleEnviarEmail} className="space-y-5" noValidate>
          
          {erro && (
            <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 p-3 rounded-xl text-sm border border-red-200 dark:border-red-900 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
            </div>
          )}
          {sucesso && (
            <div className="bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 p-3 rounded-xl text-sm border border-green-200 dark:border-green-900 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> {sucesso}
            </div>
          )}

          <div>
            <label htmlFor="email-recuperacao" className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              E-mail de Cadastro
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400 dark:text-slate-500" />
              </div>
              <input
                id="email-recuperacao"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sys-blue focus:border-sys-blue transition outline-none bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 text-sm disabled:opacity-50"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-sys-blue hover:bg-sys-blue-hover transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Enviando instruções...
              </>
            ) : (
              'Enviar link de recuperação'
            )}
          </button>
        </form>

        {/*Voltar ao Login*/}
        <div className="text-center pt-4 border-t border-gray-100 dark:border-slate-800">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-slate-400 hover:text-sys-blue dark:hover:text-sys-blue transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Voltar para a tela de login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
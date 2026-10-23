import { useState, type FormEvent } from "react";
import { UseAuth } from "../../hooks/UseAuth";
import { useTheme } from "../../contexts/ThemeContext";
import { AxiosError } from "axios";
import { Mail, Lock, ArrowRight, Eye, EyeOff, ArrowLeft, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import LogoTemplo from "/Hongwanji.png";

export function Login() {
  const { signIn } = UseAuth();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (!email || !senha) {
      setErro('Preencha os dados.'); return;
    }
    setLoading(true); setErro('');
    try {
      await signIn(email, senha);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErro(error.response?.data?.message || 'Erro de conexão.');
      } else {
        setErro('Ocorreu um erro inesperado.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 p-4 transition-colors relative">

      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:text-sys-blue dark:hover:text-sys-blue shadow-md border border-gray-150 dark:border-slate-700 transition-all cursor-pointer"
          title={theme === 'dark' ? "Mudar para modo claro" : "Mudar para modo escuro"}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/*Card Principal*/}
      <div className="w-full max-w-5xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100 dark:border-slate-800 transition-colors">

        {/*Lado Esquerdo*/}
        <div className="md:w-5/12 bg-sys-blue dark:bg-[#004e96] p-8 text-white flex flex-col justify-center items-center text-center transition-colors">
          <Link to="/" title="Ir para o site do Templo" className="cursor-pointer hover:opacity-90 transition-opacity">
            <img src={LogoTemplo} alt="Logo Honpa Hongwanji" className="w-40 h-40 object-contain -mb-2" />
          </Link>

          <h1 className="text-3xl font-bold">Assoka</h1>
          <h2 className="text-xl font-bold mb-4 text-blue-100">Nichiyougakkou</h2>
          <p className="text-blue-100 dark:text-blue-200 text-sm opacity-90">Sistema de Gestão Educacional</p>
        </div>

        {/*Lado Direito*/}
        <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-slate-900 transition-colors">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-6">Acesso ao Sistema</h2>

          <form onSubmit={handleLogin} className="space-y-5" noValidate>

            {/*Alerta de Erro*/}
            {erro && (
              <div role="alert" aria-live="assertive" className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 p-3 rounded-lg text-sm border border-red-200 dark:border-red-900 flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0" />
                <span>{erro}</span>
              </div>
            )}

            {/*Input E-mail*/}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  aria-invalid={erro ? "true" : "false"}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sys-blue focus:border-sys-blue transition outline-none bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 text-sm disabled:opacity-50"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/*Input Senha*/}
            <div>
              <label htmlFor="senha" className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                </div>
                <input
                  id="senha"
                  name="senha"
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  disabled={loading}
                  required
                  aria-invalid={erro ? "true" : "false"}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sys-blue focus:border-sys-blue transition outline-none bg-slate-50/50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 text-sm disabled:opacity-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-slate-500 hover:text-sys-blue cursor-pointer transition-colors"
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="text-right mt-2">
                <Link to="/esqueci-senha" className="text-xs text-sys-blue hover:underline ...">
                  Esqueci minha senha
                </Link>
              </div>
            </div>

            {/*Botão de Entrar*/}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sys-blue! hover:bg-sys-blue-hover! dark:bg-templo-blue! dark:hover:bg-[#004e96]! text-white! font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              <span className="text-white! font-bold text-sm tracking-wide">
                {loading ? 'Autenticando...' : 'Entrar'}
              </span>
              {!loading && <ArrowRight className="w-4 h-4 text-white!" />}
            </button>
          </form>

          {/*Link para Voltar ao Site*/}
          <div className="text-center pt-4 mt-6 border-t border-gray-100 dark:border-slate-800">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-gray-500 dark:text-slate-400 hover:text-sys-blue dark:hover:text-sys-blue transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Voltar ao site do Templo</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
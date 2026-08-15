import { useState, type FormEvent } from "react";
import { useAuth } from "../../hooks/UseAuth";
import { AxiosError } from "axios";
import { Mail, Lock, ArrowRight, EyeOff, Eye } from "lucide-react";
import LogoTemplo from "../../assets/images/Hongwanji.png";

export function Login() {
  const { signIn } = useAuth();

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
        setErro('Ocorreu um erro inesperado.')
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-6xl min-h-137.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100">

        <div className="md:w-5/12 bg-sys-blue p-8 text-white flex flex-col justify-center items-center text-center">

          <img src={LogoTemplo} alt="logo Honpa Hongwanji" className="w-48 h-48 object-contain mb-2" />
          <h1 className="text-4xl font-bold">Assoka</h1>
          <h2 className="text-2xl font-bold mb-4">Nichiyougakkou</h2>
          <p className="text-blue-100 text-sm">Sistema de Gestão Educacional</p>
        </div>

        <div className="md:w-7/12 p-8 md:p-12 flex-col justify-center bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Acesso ao Sistema</h2>

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            {erro && (
              <div role="alert" aria-live="assertive" className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200 flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0" />
                <span>{erro}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  aria-invalid={erro ? "true" : "false"}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sys-blue focus:border-sys-blue transition outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-600 mb-1">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input id="senha"
                  name="senha"
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  disabled={loading}
                  required
                  aria-invalid={erro ? "true" : "false"}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sys-blue focus:border-sys-blue transition outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-sys-blue cursor-pointer transition-all"
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              <div className="text-right mt-2">
                <a href="#" className="text-xs text-sys-blue hover:underline focus:outline-none rounded">
                  Esqueci minha senha
                </a>
              </div>
            </div>

            <button type="submit"
              disabled={loading}
              className="w-full bg-sys-blue hover:bg-sys-blue-hover text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              <span>{loading ? 'Autenticando...' : 'Entrar'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
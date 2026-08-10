import { useState, type FormEvent } from "react";
import { useAuth } from "../../hooks/UseAuth";
import { AxiosError } from "axios";

const LOGO_URL = "images/Hongwanji.png";

export function Login() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

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
    <div className="flex itens-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/20">
        
        <div className="md:w-5/12 bg-templo-blue p-8 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
            <img src={LOGO_URL} alt="" aria-hidden="true" className="w-[150%] h-auto invert"/>
          </div>

          <img src={LOGO_URL} alt="logo Honpa Hongwanji" className="h-24 w-24 object-contain invert mb-6 relative z-10"/>
          <h1 className="text-3xl font-bold mb-2 relative z-10">Assoka</h1>
          <h2 className="text-xl font-medium mb-2 relative z-10">Nichiyougakkou</h2>
          <p className="text-blue-100 text-sm relative z-10">Sistema de Gestão Educacional</p>
        </div>

        <div className="md:w-7/12 p-8 md:p-12 flex-col justify-center bg-white relative z-10">
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
              <label htmlFor="senha"  className="block text-sm font-medium text-gray-600 mb-1">Senha</label>
              
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}
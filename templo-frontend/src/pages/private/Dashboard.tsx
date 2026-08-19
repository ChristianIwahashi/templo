import { useEffect, useState } from "react";
import { UseAuth } from "../../hooks/UseAuth";
import { Api } from "../../api/Api";
import { Link } from "react-router-dom";
import {
  BookOpen, CheckCircle, AlertCircle, Megaphone,
  Users, FolderOpen, DollarSign, Clock
} from "lucide-react";

export function Dashboard() {
  const { user } = UseAuth();
  const [loading, setLoading] = useState(true);
  const [frequencia, setFrequencia] = useState(0);
  const [temPendente, setTemPendente] = useState(false);
  const [nomeTurma, setNomeTurma] = useState('Sem Turma');
  const [ultimosAvisos, setUltimosAvisos] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const currentUser = user;
    if (user.papel !== 'ALUNO') {
      setLoading(false);
      return;
    }

    async function carregarResumosDashboard() {
      try {
        setLoading(true);
        const [freqRes, mensRes, avisosRes, perfilRes] = await Promise.all([
          Api.get('/frequencia'),
          Api.get('/mensalidade'),
          Api.get('/aviso-aula'),
          Api.get(`/usuario/${currentUser.idUsuario}`)
        ]);

        //Frequência
        const totalAulas = freqRes.data.length;
        const presencas = freqRes.data.filter((f: any) => f.presente || f.presenca).length;
        setFrequencia(totalAulas > 0 ? Math.round((presencas / totalAulas) * 100) : 0);

        //Mensalidade
        const pendente = mensRes.data.some(
          (m: any) => m.statusPagamento === 'PENDENTE' || m.statusPagamento === 'ATRASADO'
        );
        setTemPendente(pendente);

        //Turma
        if (perfilRes.data?.aluno?.turma) {
          setNomeTurma(perfilRes.data.aluno.turma.idTurma);
        }

        //Avisos
        setUltimosAvisos(avisosRes.data.slice(0, 2));

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarResumosDashboard();
  }, [user]);

  function formatarData(dataStr: string) {
    return new Date(dataStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 font-medium animate-pulse">Carregando...</p>
      </div>
    );
  }

  if (user?.papel === 'ALUNO') {
    return (
      <div className="p-6 space-y-8 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/*Turma*/}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-150 flex items-center gap-4 border-l-4 border-l-blue-500">
            <div className="p-3 bg-blue-50 text-sys-blue rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Turma</p>
              <p className="text-lg font-bold text-gray-800 mt-0.5">
                {nomeTurma !== 'Sem Turma' ? `Turma ${nomeTurma}` : 'Sem Turma'}
              </p>
            </div>
          </div>

          {/*Frequência*/}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-150 flex items-center gap-4 border-l-4 border-l-green-500">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Frequência</p>
              <p className="text-lg font-bold text-gray-800 mt-0.5">{frequencia}%</p>
            </div>
          </div>

          {/*Mensalidade*/}
          <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-150 flex items-center gap-4 border-l-4 
            ${temPendente ? 'border-l-yellow-500' : 'border-l-green-500'}`}
          >
            <div className={`p-3 rounded-xl ${temPendente ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}>
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mensalidade</p>
              <p className={`text-sm font-bold mt-0.5 ${temPendente ? 'text-yellow-600' : 'text-green-600'}`}>
                {temPendente ? 'Mensalidade Pendente' : 'Mensalidades em Dia'}
              </p>
            </div>
          </div>

        </div>

        {/*Avisos*/}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-white rounded-2xl shadow-sm border border-gray-150 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-sys-blue" />
              Últimos Avisos da Turma
            </h3>

            {ultimosAvisos.length === 0 ? (
              <p className="text-sm text-gray-500 italic py-4">Nenhum aviso postado recentemente.</p>
            ) : (
              <div className="space-y-4">
                {ultimosAvisos.map((aviso: any) => (
                  <div key={aviso.idAvisoAula} className="border-l-2 border-sys-blue pl-3 py-1">
                    <p className="font-semibold text-sm text-gray-800 leading-tight">{aviso.titulo}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatarData(aviso.dataPostagem)} - Por: {aviso.professor.usuario.nome}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 border-t border-gray-100 pt-4">
              <Link to="/avisos" className="text-sm text-sys-blue font-bold hover:underline">
                Ver todos os avisos →
              </Link>
            </div>
          </div>

        </div>

      </div>
    );
  }

  {/*Professor / Gestor*/}
  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-150 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-sys-blue rounded-xl"><Users className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500">Alunos Ativos</p><p className="text-2xl font-bold text-gray-800">-</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-150 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><FolderOpen className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500">Materiais Postados</p><p className="text-2xl font-bold text-gray-800">-</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-150 flex items-center gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl"><DollarSign className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500">Mensalidades Atrasadas</p><p className="text-2xl font-bold text-gray-800">-</p></div>
        </div>
      </div>
    </div>
  );
}
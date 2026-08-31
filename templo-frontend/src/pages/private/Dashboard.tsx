import { useEffect, useState } from "react";
import { UseAuth } from "../../hooks/UseAuth";
import { Api } from "../../api/Api";
import { Link } from "react-router-dom";
import {
  BookOpen, CheckCircle, AlertCircle, Megaphone,
  Users, FolderOpen, Clock,
  GraduationCap,
  Star
} from "lucide-react";

export function Dashboard() {
  const { user } = UseAuth();
  const [loading, setLoading] = useState(true);

  //Aluno
  const [frequencia, setFrequencia] = useState(0);
  const [temPendente, setTemPendente] = useState(false);
  const [nomeTurma, setNomeTurma] = useState('Sem Turma');
  const [ultimosAvisosAluno, setUltimosAvisosAluno] = useState<any[]>([]);

  //Professor
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [totalTurmas, setTotalTurmas] = useState(0);
  const [totalMateriais, setTotalMateriais] = useState(0);
  const [ultimosAvisosProf, setUltimosAvisosProf] = useState<any[]>([]);
  const [ultimasNotasProf, setUltimasNotasProf] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const currentUser = user;

    async function carregarDadosDashboard() {
      try {
        setLoading(true);

        //Aluno
        if (currentUser.papel === 'ALUNO') {
          const [freqRes, mensRes, avisosRes, perfilRes] = await Promise.all([
            Api.get('/frequencia'),
            Api.get('/mensalidade'),
            Api.get('/aviso-aula'),
            Api.get(`/usuario/${currentUser.idUsuario}`)
          ]);

          const totalAulas = freqRes.data.length;
          const presencas = freqRes.data.filter((f: any) => f.presenca).length;
          setFrequencia(totalAulas > 0 ? Math.round((presencas / totalAulas) * 100) : 0);

          const pendente = mensRes.data.some(
            (m: any) => m.statusPagamento === 'PENDENTE' || m.statusPagamento === 'ATRASADO'
          );
          setTemPendente(pendente);

          if (perfilRes.data?.aluno?.idTurma) {
            setNomeTurma(perfilRes.data.aluno.idTurma.toString());
          }

          setUltimosAvisosAluno(avisosRes.data.slice(0, 2));

          //Professor
        } else if (currentUser.papel === 'PROFESSOR') {
          const [turmasRes, materiaisRes, avisosRes, notasRes] = await Promise.all([
            Api.get('/turma'),
            Api.get('/material-didatico'),
            Api.get('/aviso-aula'),
            Api.get('/nota')
          ]);
          const alunosUnicos = new Set<number>();
          const listaTurmas: any[] = turmasRes.data;

          listaTurmas.forEach(t => {
            if (t.alunos) {
              t.alunos.forEach((aluno: any) => alunosUnicos.add(aluno.idUsuario));
            }
          });

          setTotalAlunos(alunosUnicos.size);
          setTotalTurmas(listaTurmas.length);
          setTotalMateriais(materiaisRes.data.length);
          setUltimosAvisosProf(avisosRes.data.slice(0, 2));
          setUltimasNotasProf(notasRes.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarDadosDashboard();
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
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 border-l-blue-500">
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
          <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 
            ${frequencia >= 75 ? 'border-l-green-500' : 'border-l-red-500'}`}
          >
            <div className={`p-3 rounded-xl ${frequencia >= 75 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {frequencia >= 75 ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Frequência</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <p className={`text-lg font-bold ${frequencia >= 75 ? 'text-gray-800' : 'text-red-600'}`}>
                  {frequencia}%
                </p>
              </div>
            </div>
          </div>

          {/*Mensalidade*/}
          <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 
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

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-sys-blue" />
              Últimos Avisos da Turma
            </h3>

            {ultimosAvisosAluno.length === 0 ? (
              <p className="text-sm text-gray-500 italic py-4">Nenhum aviso postado recentemente.</p>
            ) : (
              <div className="space-y-4">
                {ultimosAvisosAluno.map((aviso: any) => (
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

  {/*Professor*/ }
  if (user?.papel === 'PROFESSOR') {
    return (
      <div className="p-6 space-y-8 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/*Total de Alunos*/}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 border-l-blue-500">
            <div className="p-3 bg-blue-50 text-sys-blue rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alunos sob sua Gestão</p>
              <p className="text-2xl font-bold text-gray-800 mt-0.5">{totalAlunos}</p>
            </div>
          </div>

          {/*Turmas Ativas*/}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 border-l-green-500">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Suas Turmas Ativas</p>
              <p className="text-2xl font-bold text-gray-800 mt-0.5">{totalTurmas}</p>
            </div>
          </div>

          {/*Materiais Didáticos*/}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 border-l-purple-500">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Materiais Postados</p>
              <p className="text-2xl font-bold text-gray-800 mt-0.5">{totalMateriais}</p>
            </div>
          </div>

        </div>

        {/*Grade Informativa*/}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/*Mural de Avisos*/}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-sys-blue" /> Últimos Avisos Enviados
              </h3>
              {ultimosAvisosProf.length === 0 ? (
                <p className="text-sm text-gray-500 italic py-4">Você ainda não publicou nenhum aviso.</p>
              ) : (
                <div className="space-y-4">
                  {ultimosAvisosProf.map((aviso: any) => (
                    <div key={aviso.idAvisoAula} className="border-l-2 border-sys-blue pl-3 py-1">
                      <p className="font-semibold text-sm text-gray-800 leading-tight">{aviso.titulo}</p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Postado em {formatarData(aviso.dataPostagem)} para a Turma {aviso.idTurma}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-6 border-t border-gray-100 pt-4">
              <Link to="/gerenciar-aviso" className="text-sm text-sys-blue font-bold hover:underline">Gerenciar mural de avisos →</Link>
            </div>
          </div>

          {/*Últimas Notas*/}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-sys-blue" /> Últimas Notas Atribuídas
              </h3>
              {ultimasNotasProf.length === 0 ? (
                <p className="text-sm text-gray-500 italic py-4">Nenhuma nota cadastrada recentemente.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b text-gray-400 uppercase tracking-wider">
                        <th className="pb-2 font-semibold">Aluno</th>
                        <th className="pb-2 font-semibold">Avaliação</th>
                        <th className="pb-2 font-semibold text-right">Nota</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {ultimasNotasProf.map((g: any) => (
                        <tr key={g.idNota} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="py-2.5 font-semibold text-gray-700">{g.aluno.usuario.nome}</td>
                          <td className="py-2.5 text-gray-500">{g.tipo}</td>
                          <td className={`py-2.5 text-right font-bold ${g.valor >= 6.0 ? 'text-sys-blue' : 'text-red-500'}`}>
                            {g.valor.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="mt-6 border-t border-gray-100 pt-4">
              <Link to="/gerenciar-nota" className="text-sm text-sys-blue font-bold hover:underline">Ir para lançamento de notas →</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
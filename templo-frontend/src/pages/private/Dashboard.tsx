import { useEffect, useState } from "react";
import { UseAuth } from "../../hooks/UseAuth";
import { Api } from "../../api/api";
import { Link } from "react-router-dom";
import { formatarDinheiro } from "../../utils/formatters";
import {
  BookOpen, CheckCircle, AlertCircle, Megaphone,
  Users, FolderOpen, DollarSign, Clock, Star,
  GraduationCap, UserCheck, Calendar, ArrowRight
} from "lucide-react";

export function Dashboard() {
  const { user } = UseAuth();
  const [loading, setLoading] = useState(true);

  //Estados do Aluno
  const [frequencia, setFrequencia] = useState(0);
  const [temPendente, setTemPendente] = useState(false);
  const [nomeTurma, setNomeTurma] = useState('Sem Turma');
  const [ultimosAvisosAluno, setUltimosAvisosAluno] = useState<any[]>([]);

  //Estados do Professor
  const [totalAlunosProf, setTotalAlunosProf] = useState(0);
  const [totalTurmasProf, setTotalTurmasProf] = useState(0);
  const [totalMateriaisProf, setTotalMateriaisProf] = useState(0);
  const [ultimosAvisosProf, setUltimosAvisosProf] = useState<any[]>([]);
  const [ultimasNotasProf, setUltimasNotasProf] = useState<any[]>([]);

  //Estados do Gestor
  const [totalAlunosGestor, setTotalAlunosGestor] = useState(0);
  const [totalProfessoresGestor, setTotalProfessoresGestor] = useState(0);
  const [totalTurmasGestor, setTotalTurmasGestor] = useState(0);
  const [inadimplenciaGestor, setInadimplenciaGestor] = useState(0);
  const [ultimosAlunosMatriculados, setUltimosAlunosMatriculados] = useState<any[]>([]);
  const [ultimosEventosGestor, setUltimosEventosGestor] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const currentUser = user;

    async function carregarDadosDashboard() {
      try {
        setLoading(true);
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

          if (perfilRes.data?.aluno?.turma?.nome) {
            setNomeTurma(perfilRes.data.aluno.turma.nome);
          } else if (perfilRes.data?.aluno?.idTurma) {
            setNomeTurma(`Turma ${perfilRes.data.aluno.idTurma}`);
          } else {
            setNomeTurma('Sem Turma');
          }
          setUltimosAvisosAluno(avisosRes.data.slice(0, 2));

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

          setTotalAlunosProf(alunosUnicos.size);
          setTotalTurmasProf(listaTurmas.length);
          setTotalMateriaisProf(materiaisRes.data.length);
          setUltimosAvisosProf(avisosRes.data.slice(0, 2));
          setUltimasNotasProf(notasRes.data.slice(0, 3));

        } else if (currentUser.papel === 'GESTOR') {
          const [usuariosRes, turmasRes, mensRes, eventosRes] = await Promise.all([
            Api.get('/usuario'),
            Api.get('/turma'),
            Api.get('/mensalidade'),
            Api.get('/aviso-evento')
          ]);

          const todosUsuarios: any[] = usuariosRes.data;
          const todasMensalidades: any[] = mensRes.data;

          const alunosAtivos = todosUsuarios.filter(u => u.papel === 'ALUNO' && u.ativo);
          const professoresAtivos = todosUsuarios.filter(u => u.papel === 'PROFESSOR' && u.ativo);

          setTotalAlunosGestor(alunosAtivos.length);
          setTotalProfessoresGestor(professoresAtivos.length);
          setTotalTurmasGestor(turmasRes.data.length);

          const totalInadimplente = todasMensalidades
            .filter(m => m.statusPagamento === 'PENDENTE' || m.statusPagamento === 'ATRASADO')
            .reduce((acc, curr) => acc + curr.valor, 0);

          setInadimplenciaGestor(totalInadimplente);
          setUltimosAlunosMatriculados(todosUsuarios.filter(u => u.papel === 'ALUNO').slice(-3).reverse());
          setUltimosEventosGestor(eventosRes.data.slice(0, 2));
        }

      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarDadosDashboard();
  }, [user]);

  function formatarData(dataStr: string) {
    if (!dataStr) return "-";
    return new Date(dataStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-slate-400 font-medium animate-pulse">Consolidando seu painel de controle...</p>
      </div>
    );
  }

  //DASHBOARD ALUNO
  if (user?.papel === 'ALUNO') {
    return (
      <div className="p-6 space-y-8 animate-fade-in-up text-slate-800 dark:text-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4 border-l-4 border-l-blue-500">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-sys-blue rounded-xl"><BookOpen className="w-6 h-6" /></div>
            <div>
              <p className="text-lg font-bold text-gray-800 dark:text-slate-100 mt-0.5">
                {nomeTurma}
              </p>
              <p className="text-lg font-bold text-gray-800 dark:text-slate-100 mt-0.5">{nomeTurma !== 'Sem Turma' ? `Turma ${nomeTurma}` : 'Sem Turma'}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4 border-l-4 border-l-green-500">
            <div className="p-3 bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-xl"><CheckCircle className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Frequência</p>
              <p className="text-lg font-bold text-gray-800 dark:text-slate-100 mt-0.5">{frequencia}%</p>
            </div>
          </div>

          <div className={`bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4 border-l-4 
            ${temPendente ? 'border-l-yellow-500' : 'border-l-green-500'}`}
          >
            <div className={`p-3 rounded-xl ${temPendente ? 'bg-yellow-50 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400' : 'bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400'}`}>
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Situação Financeira</p>
              <p className={`text-sm font-bold mt-0.5 ${temPendente ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                {temPendente ? 'Mensalidade Pendente' : 'Mensalidades em Dia'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
            <h3 className="font-bold text-gray-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-sys-blue" /> Últimos Avisos da Turma
            </h3>
            {ultimosAvisosAluno.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-slate-400 italic py-4">Nenhum aviso postado recentemente.</p>
            ) : (
              <div className="space-y-4">
                {ultimosAvisosAluno.map((aviso: any) => (
                  <div key={aviso.idAvisoAula} className="border-l-2 border-sys-blue pl-3 py-1">
                    <p className="font-semibold text-sm text-gray-800 dark:text-slate-100 leading-tight">{aviso.titulo}</p>
                    <p className="text-xs text-gray-400 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatarData(aviso.dataPostagem)} - Por: {aviso.professor.usuario.nome}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 border-t border-gray-100 dark:border-slate-800 pt-4">
              <Link to="/avisos" className="text-sm text-sys-blue font-bold hover:underline">Ver todos os avisos →</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  //DASHBOARD PROFESSOR
  if (user?.papel === 'PROFESSOR') {
    return (
      <div className="p-6 space-y-8 animate-fade-in-up text-slate-800 dark:text-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4 border-l-4 border-l-blue-500">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-sys-blue rounded-xl"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Alunos sob sua Gestão</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-slate-100 mt-0.5">{totalAlunosProf}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4 border-l-4 border-l-green-500">
            <div className="p-3 bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-xl"><GraduationCap className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Suas Turmas Ativas</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-slate-100 mt-0.5">{totalTurmasProf}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4 border-l-4 border-l-purple-500">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl"><FolderOpen className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Materiais Postados</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-slate-100 mt-0.5">{totalMateriaisProf}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-sys-blue" /> Últimos Avisos Enviados
              </h3>
              {ultimosAvisosProf.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-slate-400 italic py-4">Você ainda não publicou nenhum aviso.</p>
              ) : (
                <div className="space-y-4">
                  {ultimosAvisosProf.map((aviso: any) => (
                    <div key={aviso.idAvisoAula} className="border-l-2 border-sys-blue pl-3 py-1">
                      <p className="font-semibold text-sm text-gray-800 dark:text-slate-100 leading-tight">{aviso.titulo}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Postado em {formatarData(aviso.dataPostagem)} para a Turma {aviso.idTurma}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-6 border-t border-gray-100 dark:border-slate-800 pt-4">
              <Link to="/gerenciar-avisos" className="text-sm text-sys-blue font-bold hover:underline">Gerenciar mural de avisos →</Link>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-sys-blue" /> Últimas Notas Atribuídas
              </h3>
              {ultimasNotasProf.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-slate-400 italic py-4">Nenhuma nota cadastrada recentemente.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 dark:text-slate-400 uppercase tracking-wider">
                        <th className="pb-2 font-semibold">Aluno</th>
                        <th className="pb-2 font-semibold">Avaliação</th>
                        <th className="pb-2 font-semibold text-right">Nota</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-50 dark:divide-slate-800">
                      {ultimasNotasProf.map((g: any) => (
                        <tr key={g.idNota} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-2.5 font-semibold text-gray-700 dark:text-slate-200">{g.aluno.usuario.nome}</td>
                          <td className="py-2.5 text-gray-500 dark:text-slate-400">{g.tipo}</td>
                          <td className={`py-2.5 text-right font-bold ${g.valor >= 7.0 ? 'text-sys-blue' : 'text-red-500'}`}>
                            {g.valor.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="mt-6 border-t border-gray-100 dark:border-slate-800 pt-4">
              <Link to="/gerenciar-notas" className="text-sm text-sys-blue font-bold hover:underline">Ir para lançamento de notas →</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  //DASHBOARD GESTOR
  return (
    <div className="p-6 space-y-8 animate-fade-in-up text-slate-800 dark:text-slate-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-sys-blue rounded-xl"><Users className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Alunos Matriculados</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-slate-100 mt-0.5">{totalAlunosGestor}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4 border-l-4 border-l-green-500">
          <div className="p-3 bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-xl"><UserCheck className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Corpo Docente Ativo</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-slate-100 mt-0.5">{totalProfessoresGestor}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4 border-l-4 border-l-purple-500">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl"><GraduationCap className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Turmas Abertas</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-slate-100 mt-0.5">{totalTurmasGestor}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4 border-l-4 border-l-yellow-500">
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400 rounded-xl"><DollarSign className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Inadimplência Total</p>
            <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mt-0.5">{formatarDinheiro(inadimplenciaGestor)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-sys-blue" /> Últimos Alunos Cadastrados
              </h3>
            </div>

            {ultimosAlunosMatriculados.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-slate-400 italic py-4">Nenhum aluno registrado no sistema.</p>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {ultimosAlunosMatriculados.map((aluno: any) => (
                  <div key={aluno.idUsuario} className="py-2.5 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-slate-100 leading-tight">{aluno.nome}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-400 mt-0.5">{aluno.email}</p>
                    </div>
                    <span className="text-xs font-mono font-medium text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded">
                      Matrícula #{aluno.idUsuario}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-gray-100 dark:border-slate-800 pt-4">
            <Link to="/gerenciar-alunos" className="text-sm text-sys-blue font-bold hover:underline flex items-center gap-1">
              Ver lista completa de alunos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sys-blue" /> Agenda do Website Institucional
              </h3>
            </div>

            {ultimosEventosGestor.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-slate-400 italic py-4">Nenhum evento agendado na página pública.</p>
            ) : (
              <div className="space-y-3">
                {ultimosEventosGestor.map((evento: any) => (
                  <div key={evento.idAvisoEvento} className="border border-gray-100 dark:border-slate-800 rounded-xl p-3 bg-slate-50/40 dark:bg-slate-800/40 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm text-gray-800 dark:text-slate-100">{evento.titulo}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-400 mt-0.5">Postado em {formatarData(evento.dataPostagem)}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${evento.ativo ? 'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700'
                      }`}>
                      {evento.ativo ? 'Público' : 'Oculto'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-gray-100 dark:border-slate-800 pt-4">
            <Link to="/gerenciar-informatico" className="text-sm text-sys-blue font-bold hover:underline flex items-center gap-1">
              Gerenciar todo o website <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
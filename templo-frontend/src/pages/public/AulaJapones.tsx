import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Api } from "../../api/Api";
import { Calendar, Clock, GraduationCap, CheckCircle2, Phone, Mail, ExternalLink, RefreshCw } from "lucide-react";
import LogoTemplo from "../../assets/images/Hongwanji.png";

interface ConteudoDB {
  idConteudo: number;
  categoria: string;
  titulo: string;
  texto: string;
  imagemUrl: string;
}

export function AulasJapones() {
  const [conteudos, setConteudos] = useState<ConteudoDB[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDadosAulas() {
      try {
        setLoading(true);
        const response = await Api.get('/conteudo-informativo?categoria=AULAS');
        setConteudos(response.data || []);
      } catch (error) {
        console.warn("Utilizando informações curriculares padrão.");
      } finally {
        setLoading(false);
      }
    }
    carregarDadosAulas();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-3">
        <RefreshCw className="w-8 h-8 text-templo-blue animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Carregando informações pedagógicas...</p>
      </div>
    );
  }

  const imagemDinamica = conteudos.length > 0 && conteudos[0].imagemUrl ? conteudos[0].imagemUrl : null;

  return (
    <article className="space-y-12 animate-fade-in-up text-slate-800 dark:text-slate-100">
      <header className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-templo-blue dark:text-sys-blue tracking-tight">
          Aulas de Língua Japonesa
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 opacity-90">
          Aprenda o idioma, treine a escrita e a caligrafia e mergulhe na rica cultura nipo-brasileira preservada pelo templo através da escola Assoka.
        </p>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2">
        <div className="bg-blue-50/70 dark:bg-slate-800/60 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-100 dark:border-slate-800 min-h-75 relative overflow-hidden">
          <img 
            src={imagemDinamica || LogoTemplo} 
            alt="Escola Assoka Nichiyougakkou" 
            className={`object-contain mb-4 ${imagemDinamica ? 'w-full h-full absolute inset-0 object-cover' : 'w-32 h-32'}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = LogoTemplo;
            }}
          />
          {imagemDinamica && <div className="absolute inset-0 bg-black/30 pointer-events-none" />}
        </div>

        <div className="p-8 sm:p-10 flex flex-col justify-between space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              {conteudos.length > 0 ? conteudos[0].titulo : "Metodologia e Estrutura"}
            </h3>
            
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {conteudos.length > 0 
                ? conteudos[0].texto 
                : "Nossas turmas são divididas de acordo com o nível de proficiência de cada estudante (do básico ao intermediário). O currículo abrange leitura (Hiragana, Katakana e Kanji), gramática prática, conversação e preparação para o exame internacional de proficiência JLPT."
              }
            </p>
          </div>

          <ul className="space-y-4 border-t border-gray-100 dark:border-slate-800 pt-6">
            <li className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-templo-blue dark:text-sys-blue rounded-xl shrink-0 mt-0.5">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm font-bold text-slate-800 dark:text-slate-100">Dia das Aulas</strong>
                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Todos os sábados</span>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-templo-blue dark:text-sys-blue rounded-xl shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm font-bold text-slate-800 dark:text-slate-100">Horário Regular</strong>
                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">08h30 às 10h30</span>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-templo-blue dark:text-sys-blue rounded-xl shrink-0 mt-0.5">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm font-bold text-slate-800 dark:text-slate-100">Faixa Etária</strong>
                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Turmas para crianças, jovens e adultos</span>
              </div>
            </li>
          </ul>

          <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <Link
              to="/login"
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base bg-templo-blue hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Acessar Portal do Aluno</span>
              <ExternalLink className="w-4 h-4" />
            </Link>

            <p className="text-center text-xs text-slate-400 dark:text-slate-500">
              Novas matrículas são realizadas presencialmente na secretaria ou pelo contato abaixo.
            </p>
          </div>
        </div>
      </div>

      <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-2">
          <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" /> Como ingressar nas aulas?
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            As matrículas ficam abertas enquanto houver vagas. Caso você já tenha algum conhecimento prévio da língua japonesa, nossa equipe pedagógica realiza uma breve avaliação de nivelamento para indicar a turma ideal.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 text-xs space-y-2 text-slate-700 dark:text-slate-300">
          <p className="font-bold text-templo-blue dark:text-sys-blue uppercase tracking-wider">Secretaria Assoka</p>
          <p className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-templo-blue dark:text-sys-blue" /> (14) 3522-3184
          </p>
          <p className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-templo-blue dark:text-sys-blue" /> ksklins@gmail.com
          </p>
        </div>
      </section>
    </article>
  );
}
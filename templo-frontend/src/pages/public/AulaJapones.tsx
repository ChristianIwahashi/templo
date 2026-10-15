import { useEffect, useState } from "react";
import { Api } from "../../api/Api";
import { Calendar, Clock, GraduationCap, CheckCircle2, Phone, Mail, RefreshCw } from "lucide-react";
import LogoTemplo from "../../assets/images/Hongwanji.png";

interface ConteudoDB {
  idConteudo: number;
  categoria: string;
  titulo: string;
  texto: string;
  midiaUrl: string;
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
        <RefreshCw className="w-8 h-8 text-[#0060ba] animate-spin" />
        <p className="text-slate-500 font-medium text-sm">Carregando informações pedagógicas...</p>
      </div>
    );
  }

  return (
    <article className="space-y-12 animate-fade-in-up">
      {/*Cabeçalho*/}
      <header className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0060ba] tracking-tight">
          Aulas de Língua Japonesa
        </h1>
        <p className="text-base sm:text-lg text-slate-600 opacity-90">
          Aprenda o idioma, treine a escrita e a caligrafia e mergulhe na rica cultura nipo-brasileira preservada pelo templo através da escola Assoka.
        </p>
      </header>

      {/*Card Principal*/}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-150 grid grid-cols-1 md:grid-cols-2">
        
        {/*Lado Esquerdo: Logo Institucional*/}
        <div className="bg-blue-50/70 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-100 min-h-75">
          <img 
            src={LogoTemplo} 
            alt="Escola Assoka Nichiyougakkou" 
            className="w-32 h-32 object-contain mb-4"
          />
          <h2 className="text-2xl font-bold text-[#0060ba]">Assoka Nichiyougakkou</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-semibold">
            Escola de Língua Japonesa de Lins
          </p>
        </div>

        {/*Lado Direito: Detalhes, Horários e Metodologia*/}
        <div className="p-8 sm:p-10 flex flex-col justify-between space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {conteudos.length > 0 ? conteudos[0].titulo : "Metodologia e Estrutura"}
            </h3>
            
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {conteudos.length > 0 
                ? conteudos[0].texto 
                : "Nossas turmas são divididas de acordo com o nível de proficiência de cada estudante (do básico ao intermediário). O currículo abrange leitura (Hiragana, Katakana e Kanji), gramática prática, conversação e preparação para o exame internacional de proficiência JLPT."
              }
            </p>
          </div>

          {/*Lista de Horários e Dias*/}
          <ul className="space-y-4 border-t border-gray-100 pt-6">
            <li className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-50 text-[#0060ba] rounded-xl shrink-0 mt-0.5">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm font-bold text-slate-800">Dia das Aulas</strong>
                <span className="text-xs sm:text-sm text-slate-500">Todos os sábados</span>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-50 text-[#0060ba] rounded-xl shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm font-bold text-slate-800">Horário Regular</strong>
                <span className="text-xs sm:text-sm text-slate-500">08h30 às 10h30</span>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-50 text-[#0060ba] rounded-xl shrink-0 mt-0.5">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm font-bold text-slate-800">Faixa Etária</strong>
                <span className="text-xs sm:text-sm text-slate-500">Turmas para crianças, jovens e adultos</span>
              </div>
            </li>
          </ul>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <p className="text-center text-xs text-slate-400">
              Novas matrículas são realizadas presencialmente na secretaria ou pelo contato abaixo.
            </p>
          </div>
        </div>

      </div>

      {/*Seção Informativa*/}
      <section className="bg-white p-8 rounded-3xl border border-gray-150 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-2">
          <h4 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" /> Como ingressar nas aulas?
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            As matrículas ficam abertas enquanto houver vagas. Caso você já tenha algum conhecimento prévio da língua japonesa, nossa equipe pedagógica realiza uma breve avaliação de nivelamento para indicar a turma ideal.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 text-xs space-y-2 text-slate-700">
          <p className="font-bold text-[#0060ba] uppercase tracking-wider">Secretaria Assoka</p>
          <p className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#0060ba]" /> (14) 3522-3184
          </p>
          <p className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-[#0060ba]" /> ksklins@gmail.com
          </p>
        </div>
      </section>
    </article>
  );
}
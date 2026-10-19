import { useEffect, useState } from "react";
import { Api } from "../../api/Api";
import { RefreshCw } from "lucide-react";
import LogoTemplo from "../../assets/images/Hongwanji.png";

interface ConteudoDB {
  idConteudo: number;
  categoria: string;
  titulo: string;
  texto: string;
  imagemUrl: string;
}

export function Sobre() {
  const [conteudos, setConteudos] = useState<ConteudoDB[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarHistoria() {
      try {
        setLoading(true);
        const response = await Api.get('/conteudo-informativo?categoria=HISTORIA');
        setConteudos(response.data || []);
      } catch (error) {
        console.warn("Utilizando documentação institucional padrão.");
      } finally {
        setLoading(false);
      }
    }

    carregarHistoria();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-3">
        <RefreshCw className="w-8 h-8 text-templo-blue animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Carregando história institucional...</p>
      </div>
    );
  }

  return (
    <article className="space-y-16 animate-fade-in-up">
      
      {/*Cabeçalho*/}
      <header className="text-center space-y-3 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-templo-blue dark:text-sys-blue tracking-tight leading-tight">
          Templo Honpa Hongwanji de Lins
        </h1>
        <p className="text-lg sm:text-xl font-medium text-slate-600 dark:text-slate-300 italic">
          Namo Amidabutsu
        </p>
      </header>

      {conteudos.length > 0 ? (
        <div className="space-y-12">
          {conteudos.map((item) => (
            <div key={item.idConteudo} className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-200 flow-root border-b border-gray-150 dark:border-slate-800 pb-10 last:border-none">
              
              {item.imagemUrl && (
                <div className="w-full md:w-1/2 lg:w-5/12 md:float-right md:ml-10 mb-8 rounded-2xl overflow-hidden shadow-xl bg-gray-100 dark:bg-slate-800 aspect-4/3 border border-gray-200 dark:border-slate-700">
                  <img 
                    src={item.imagemUrl} 
                    alt={item.titulo} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              )}

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">{item.titulo}</h2>
              <p className="whitespace-pre-line leading-relaxed text-slate-600 dark:text-slate-300">{item.texto}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 flow-root">
          
          <div className="w-full md:w-1/2 lg:w-5/12 md:float-right md:ml-10 mb-8 rounded-2xl overflow-hidden shadow-2xl bg-blue-50 dark:bg-slate-800 aspect-4/3 border border-blue-100 dark:border-slate-700 flex items-center justify-center p-8">
            <img 
              src={LogoTemplo} 
              alt="Brasão do Templo Honpa Hongwanji" 
              className="w-36 h-36 object-contain"
            />
          </div>

          <div className="space-y-6">
            <p>
              Localizado na Rua Nove de Julho, 1455, o <strong className="text-slate-900 dark:text-slate-100">Templo Honpa Hongwanji de Lins</strong> é um marco da imigração e da preservação cultural nipo-brasileira no interior paulista. Pertencente à Comunidade Budista Sul-Americana Jodo Shinshu Hongwanji-ha (Shin Budismo da Terra Pura), o templo carrega décadas de história comunitária, devoção e gratidão.
            </p>
            <p>
              A história da instituição está ligada aos pioneiros japoneses que chegaram à região para o desenvolvimento da agricultura. Em 1954, o templo estabeleceu sua sede oficial, evento marcado pela chegada da Sacerdotisa Kunkai Okayama, vinda da matriz em Kyoto, no Japão.
            </p>
            <p>
              Hoje, a assistência religiosa de Lins e região é conduzida com dedicação pela sacerdotisa, a Reverenda (Monja) Chijo Okayama. O templo também abriga a Escola Dominical Asoka e o grupo de jovens Koorin Seinenkai, preservando os valores budistas e o ensino do idioma japonês de forma ininterrupta.
            </p>
          </div>
        </div>
      )}
    </article>
  );
}
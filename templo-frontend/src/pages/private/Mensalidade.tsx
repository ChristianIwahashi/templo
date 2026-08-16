import { useEffect, useState } from "react";
import { Api } from "../../api/Api";
import { DollarSign} from "lucide-react";

interface Mensalidade {
    idMensalidade: number;
    mes: string;
    valor: number;
    dataVencimento: string;
    statusPagamento: 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'CANCELADO';
    payDate?: string;
}

export function Mensalidade() {
    const [mensalidades, setMensalidades] = useState<Mensalidade[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    
    const [filtroOrdem, setFiltroOrdem] = useState<'desc' | 'asc'>('desc');
    const [filtroStatus, setFiltroStatus] = useState<string>('todos');
    const [filtroAno, setFiltroAno] = useState<string>('todos');

    useEffect(() => {
        async function carregarMensalidade() {
            try {
                setLoading(true);
                const response = await Api.get('/mensalidade');
                setMensalidades(response.data);
            } catch (error) {
                console.error(error);
                setErro('Não foi possível carregar o seu histórico de mensalidades.');
            } finally {
                setLoading(false);
            }
        }

        carregarMensalidade();
    }, []);

    // filtro e ordenação
    const anosDisponiveis = Array.from(
        new Set(mensalidades.map(m => new Date(m.dataVencimento).getUTCFullYear()))
    ).sort((a, b) => b - a);

    const mensalidadesFiltradas = mensalidades.filter((m) => {
        const matchesStatus = filtroStatus === 'todos' ? true : m.statusPagamento === filtroStatus;
        const matchesAno = filtroAno === 'todos' ? true : new Date(m.statusPagamento).getUTCFullYear().toString() === filtroAno;
        return matchesStatus && matchesAno;
    })
    .sort((a, b) => {
        const dataA = new Date(a.dataVencimento).getTime();
        const dataB = new Date(b.dataVencimento).getTime();
        return filtroOrdem === 'desc' ? dataB - dataA : dataA - dataB;
    });

    function formatarDinheiro(centavos: number) {
        return (centavos /100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function formatarData(dataStr: string) {
        return new Date(dataStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    }

    if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 font-medium animate-pulse">Carregando...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 font-semibold text-center">
          {erro}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      
      {/*Filtros*/}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
        
        {/*Ordem*/}
        <div className="flex-1 min-w-50">
          <label htmlFor="ordem" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 items-center gap-1.5">
            Ordenação
          </label>
          <select 
            id="ordem"
            value={filtroOrdem}
            onChange={e => setFiltroOrdem(e.target.value as 'desc' | 'asc')}
            className="w-full p-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 cursor-pointer"
          >
            <option value="desc">Mais recentes primeiro</option>
            <option value="asc">Mais antigas primeiro</option>
          </select>
        </div>

        {/*Status*/}
        <div className="flex-1 min-w-50">
          <label htmlFor="status" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Status
          </label>
          <select 
            id="status"
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            className="w-full p-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 cursor-pointer"
          >
            <option value="todos">Todos os status</option>
            <option value="PENDENTE">Pendentes</option>
            <option value="PAGO">Pagos</option>
            <option value="ATRASADO">Atrasados</option>
          </select>
        </div>

        {/* Ano Dinâmico */}
        <div className="flex-1 min-w-37.5">
          <label htmlFor="ano" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Ano
          </label>
          <select 
            id="ano"
            value={filtroAno}
            onChange={e => setFiltroAno(e.target.value)}
            className="w-full p-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sys-blue bg-slate-50/50 cursor-pointer"
          >
            <option value="todos">Todos os anos</option>
            {anosDisponiveis.map(ano => (
              <option key={ano} value={ano.toString()}>{ano}</option>
            ))}
          </select>
        </div>

      </div>

      {/*Mensalidades*/}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-sys-blue" />
          <h4 className="font-bold text-gray-700">Histórico de Mensalidades</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-600 bg-gray-50/30">
                <th className="p-4 font-semibold">Mês de Ref.</th>
                <th className="p-4 font-semibold">Vencimento</th>
                <th className="p-4 font-semibold">Valor</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Data do Pagamento</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {mensalidadesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                    Nenhuma mensalidade encontrada com os filtros atuais.
                  </td>
                </tr>
              ) : (
                mensalidadesFiltradas.map((m) => (
                  <tr key={m.idMensalidade} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-semibold text-gray-800">{m.mes}</td>
                    <td className="p-4 text-gray-600">{formatarData(m.dataVencimento)}</td>
                    <td className="p-4 font-semibold text-gray-700">{formatarDinheiro(m.valor)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide
                        ${m.statusPagamento === 'PAGO' && 'bg-green-50 text-green-700 border border-green-200'}
                        ${m.statusPagamento === 'PENDENTE' && 'bg-yellow-50 text-yellow-700 border border-yellow-200'}
                        ${m.statusPagamento === 'ATRASADO' && 'bg-red-50 text-red-700 border border-red-200'}
                        ${m.statusPagamento === 'CANCELADO' && 'bg-gray-50 text-gray-600 border border-gray-200'}
                      `}>
                        {m.statusPagamento}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{m.payDate ? formatarData(m.payDate) : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
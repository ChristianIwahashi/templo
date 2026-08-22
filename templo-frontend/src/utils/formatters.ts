export function formatarData(dataStr: string): string {
  if (!dataStr) return "-";
  return new Date(dataStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

export function formatarDinheiro(centavos: number): string {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function obterEstiloStatusPagamento(status: 'PAGO' | 'PENDENTE' | 'ATRASADO' | 'CANCELADO' | string): string {
  const estilos = {
    PAGO: 'bg-green-50 text-green-700 border border-green-200',
    PENDENTE: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    ATRASADO: 'bg-red-50 text-red-700 border border-red-200',
    CANCELADO: 'bg-gray-50 text-gray-600 border border-gray-200',
  };

  return estilos[status as keyof typeof estilos] || estilos.CANCELADO;
}
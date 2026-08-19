export function formatarData(dataStr: string): string {
  if (!dataStr) return "-";
  return new Date(dataStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

export function formatarDinheiro(centavos: number): string {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
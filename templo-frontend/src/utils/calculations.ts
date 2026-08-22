interface NotaSimplificada {
  valor: number;
}

interface FrequenciaSimplificada {
  presenca: boolean;
}

export function calcularMediaGeral(notas: NotaSimplificada[]): number {
  if (notas.length === 0) return 0;
  const soma = notas.reduce((acc, nota) => acc + nota.valor, 0);
  return soma / notas.length;
}

export function calcularPercentualFrequencia(frequencias: FrequenciaSimplificada[]): number {
  if (frequencias.length === 0) return 0;
  const total = frequencias.length;
  const presencas = frequencias.filter(f => f.presenca).length;
  return Math.round((presencas / total) * 100);
}
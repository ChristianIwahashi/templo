export const padraoTelefone = (value: string): string => {
  const apenasNumeros = value.replace(/\D/g, "");
  const numeroLimitado = apenasNumeros.slice(0, 11);

  if (numeroLimitado.length <= 2) {
    return numeroLimitado.replace(/^(\d{0,2})/, "($1");
  }
  if (numeroLimitado.length <= 6) {
    return numeroLimitado.replace(/^(\d{2})(\d{0,4})/, "($1) $2");
  }
  if (numeroLimitado.length <= 10) {
    return numeroLimitado.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  }
  return numeroLimitado.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};
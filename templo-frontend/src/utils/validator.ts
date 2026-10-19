export const regexTextoSeguro = /^(?=.*[a-zA-Z0-9À-ÿ])[a-zA-Z0-9À-ÿ\s.!?,;\-_@()]+$/;
export function validarSenhaForte(senha: string): boolean {
  const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?]).{6,}$/;
  return regexSenha.test(senha);
}
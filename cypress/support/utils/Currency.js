/**
 * Converte um texto de valor monetário (ex: "R$78.90" ou "R$ 78,90")
 * em number (78.9), para permitir comparações matemáticas nos testes.
 */
export function parseCurrency(text) {
  return parseFloat(
    text
      .replace('R$', '') // remove o prefixo de moeda
      .trim() // remove espaços nas pontas
      .replace(',', '.'), // normaliza vírgula decimal para ponto, se houver
  );
}
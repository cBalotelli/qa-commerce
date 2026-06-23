import { faker } from '@faker-js/faker';

/**
 * Gera um conjunto completo de dados de usuário para o checkout.
 * Usar dados dinâmicos (em vez de hardcoded) evita falsos positivos
 * causados por dependência de um valor fixo já usado em execuções
 * anteriores, e aumenta a cobertura real do teste a cada execução.
 */
export function generateUser() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    address: faker.location.streetAddress(),
    number: String(faker.number.int({ min: 1, max: 9999 })),
    cep: faker.location.zipCode('#####-###'),
    phone: faker.phone.number(),
    email: faker.internet.email(),
  };
}

/**
 * Gera dados de cartão de crédito válidos no formato (não reais,
 * apenas estruturalmente válidos para preencher o formulário).
 */
export function generateCreditCard() {
  const futureDate = faker.date.future();
  const month = String(futureDate.getMonth() + 1).padStart(2, '0');
  const year = String(futureDate.getFullYear()).slice(-2);

  return {
    number: faker.finance.creditCardNumber(),
    expiry: `${month}/${year}`,
    cvc: faker.finance.creditCardCVV(),
  };
}

/**
 * Gera uma senha aleatória para os cenários de criação de conta.
 */
export function generatePassword() {
  return faker.internet.password({ length: 10 });
}
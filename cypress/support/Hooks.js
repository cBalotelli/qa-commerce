import { Before } from '@badeball/cypress-cucumber-preprocessor';

/**
 * Roda antes de TODO cenário, de TODA feature.
 *
 * Garante que cada cenário comece do zero (carrinho vazio, sem sessão
 * residual), evitando que o estado deixado por um teste "vaze" e
 * influencie o resultado do próximo — uma das causas mais comuns de
 * testes "flaky" em suítes de e-commerce.
 */
Before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
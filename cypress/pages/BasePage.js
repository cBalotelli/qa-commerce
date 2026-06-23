/**
 * BasePage
 * ---------
 * Classe-mãe de todos os Page Objects do projeto.
 * Aqui ficam SOMENTE ações genéricas que não pertencem a nenhuma tela
 * específica (visitar, clicar, digitar, verificar visibilidade, etc).
 *
 * Por que isso importa: se um dia trocarmos de framework de automação
 * (ex: Cypress -> Playwright), só este arquivo precisa ser reescrito.
 * Nenhum Page Object filho, nenhum step e nenhuma .feature precisam mudar,
 * porque eles não conhecem o Cypress diretamente — só conhecem os métodos
 * desta classe.
 */
export default class BasePage {
  /**
   * Visita uma URL relativa ao baseUrl configurado no cypress.config.js.
   */
  visit(path = '/') {
    cy.visit(path);
  }

  /**
   * Retorna o elemento (sem agir sobre ele). Usado quando quem chamou
   * precisa encadear outros comandos do Cypress por cima (ex: .eq(), .first()).
   */
  getElement(selector) {
    return cy.get(selector);
  }

  /**
   * Conta quantos elementos casam com o seletor SEM lançar erro caso
   * não exista nenhum.
   *
   * Isso é necessário porque cy.get(selector) sozinho FALHA com timeout
   * se zero elementos forem encontrados — o que quebraria, por exemplo,
   * a verificação de "carrinho vazio" (0 itens é um resultado válido,
   * não um erro).
   */
  getElementCount(selector) {
    return cy.get('body').then(($body) => $body.find(selector).length);
  }

  /**
   * Clica em um elemento.
   */
  clickElement(selector) {
    cy.get(selector).click();
  }

  /**
   * Marca um checkbox/radio. Usa .check() em vez de .click() porque
   * o Cypress valida que o elemento realmente é "checkable" antes de agir,
   * o que evita falsos positivos em testes de seleção de opções.
   */
  checkOption(selector) {
    cy.get(selector).check();
  }

  /**
   * Limpa e digita um valor em um campo de texto.
   * O .clear() é essencial: sem ele, o Cypress concatena o texto novo
   * com o que já existir no campo, gerando falhas difíceis de depurar.
   */
  typeInField(selector, text) {
    cy.get(selector).clear().type(text);
  }

  /**
   * Asserção de visibilidade.
   */
  shouldBeVisible(selector) {
    cy.get(selector).should('be.visible');
  }

  /**
   * Retorna o texto de um elemento (chainable do Cypress).
   */
  getText(selector) {
    return cy.get(selector).invoke('text');
  }

  /**
   * Espera ativamente até um loader sumir da tela, em vez de usar
   * cy.wait(tempo fixo) — que é uma prática ruim (flaky por natureza).
   */
  waitForLoader() {
    cy.get('[data-cy="loading"]', { timeout: 10000 }).should('not.exist');
  }
}

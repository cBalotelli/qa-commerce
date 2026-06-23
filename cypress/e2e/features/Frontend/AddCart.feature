Feature: Adicionar Produto ao Carrinho

  Background:
    Given que o usuário está na página inicial da loja


  @BeforeCarrinhoVazio @skipTeardown @TestFrontAddCarrinho
  Scenario: Adicionar um produto disponível ao carrinho
    When o usuário adiciona o primeiro produto ao carrinho
    Then o produto deve ser listado no carrinho
    And o valor total deve corresponder ao preço do produto


  @BeforeCarrinhoVazio @TestFrontRemover
  Scenario: Remover produto do carrinho
    Given que o usuário possui um produto no carrinho
    When o usuário remove o produto do carrinho
    Then o carrinho deve ficar vazio
    And o valor total deve ser zero


  @BeforeCarrinhoVazio @skipTeardown @TestFrontMultItens
  Scenario: Carrinho reflete corretamente múltiplos produtos diferentes
    Given que o carrinho esta vazio
    When o usuário adiciona multiplos produtos diferentes ao carrinho
    Then o carrinho deve exibir a quantidade exata de produtos adicionados
    And o valor total deve ser a soma dos preços de todos os produtos no carrinho


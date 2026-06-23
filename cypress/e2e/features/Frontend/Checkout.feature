Feature: Checkout Simples

  Background:
    Given que o usuário está na tela de carrinho
    And possui um ou mais produtos no carrinho
    And acessou a página de checkout

  @TestFrontCheckoutCredito
  Scenario: Finalizar checkout com pagamento no cartão de crédito
    When o usuário preenche todos os campos obrigatórios
    And seleciona o método de pagamento "cartão de crédito"
    And preenche os dados do cartão
    And aceita os termos
    And confirma o pedido
    Then o sistema deve exibir a tela do status do pedido
    And o id do pedido é exibido
    And status do pagamento aprovado
  
@TestFrontCampoObrigatorio
Scenario: Bloquear finalização de pedido com dados incompletos
    When o usuário deixa de preencher um campo obrigatório aleatório
    And seleciona o método de pagamento "cartão de crédito"
    And aceita os termos
    And confirma o pedido
    Then deve exibir um alerta de erro no formulário


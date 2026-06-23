Feature: API de Carrinho
  @skipTeardown @TestApiCarrinho
  Scenario: Adicionar produto ao carrinho com sucesso
    Given que preparo a requisição para a API "Adicionar itens ao carrinho"
    And defino o corpo da requisição com os seguintes dados:
      | userId | productId | quantity |
      | 1      |   1       | 2        |
    When envio a requisição
    Then o status code deve ser 201
    And o response deve retornar mensagem de sucesso
  @skipTeardown @TestApiLista
  Scenario: Listar itens do carrinho de um usuário
    Given que preparo a requisição para a API "Listar itens do carrinho"
    And informo o parâmetro de rota "userId" com o valor "1"
    When envio a requisição
    Then o status code deve ser 200
    And o corpo da resposta deve listar os itens do carrinho

  @skipTeardown @TesteApiRemover
  Scenario: Remover todos os itens do carrinho de um usuário
    Given que preparo a requisição para a API "Esvaziar carrinho"
    And informo o parâmetro de rota "userId" com o valor "1"
    When envio a requisição
    Then o status code deve ser 200
    And a resposta deve confirmar a exclusão dos itens
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import apiService from '../support/api/ApiService';


// --- Setup / navegação ---

Given('que preparo a requisição para a API {string}', (nomeDaApi) => {
  apiService.prepararRequisicao(nomeDaApi);
});

Given('informo o parâmetro de rota {string} com o valor {string}', (chave, valor) => {
  apiService.adicionarParametroDeRota(chave, valor);
});

Given('defino o corpo da requisição com os seguintes dados:', (dataTable) => {
  // Converte a tabela do Gherkin diretamente para um objeto JSON (Body)
  // O dataTable.hashes()[0] pega a primeira linha de valores abaixo do cabeçalho
  const payload = dataTable.hashes()[0];
  
  // Converte os dados que vieram como string do Gherkin para número, se necessário
  payload.userId = Number(payload.userId);
  payload.productId = Number(payload.productId);
  payload.quantity = Number(payload.quantity);
  apiService.adicionarPayload(payload);
  cy.log(JSON.stringify(payload));
});


// --- Ações ---


When('envio a requisição', () => {
  apiService.enviarRequisicao();
});

// --- Validações ---



Then('o status code deve ser {int}', (statusCodeEsperado) => {
  // recupera a resposta salva no alias '@apiResponse' e validamos
  cy.get('@apiResponse').its('status').should('eq', statusCodeEsperado);
});

Then('o response deve retornar mensagem de sucesso', () => {
  cy.get('@apiResponse').then((response) => {
    // Printa o conteúdo da resposta no console para facilitar o debug caso quebre
    cy.log(JSON.stringify(response.body));
    
    // Acessa exatamente a chave "message" do JSON e valida o texto cravado
    expect(response.body.message).to.eq('Produto adicionado ao carrinho com sucesso.');
  });
});

//bloco de STEPS ESPECÍFICOS (Regras de Negócio)

Then('o corpo da resposta deve listar os itens do carrinho', () => {
  cy.get('@apiResponse').then((response) => {
    cy.log(JSON.stringify(response.body));
    
    expect(response.body).to.be.an('array'); 
  });
});


Then('a resposta deve confirmar a exclusão dos itens', () => {
  cy.get('@apiResponse').then((response) => {
    
    expect(response.body.message).to.eq('Todos os itens do carrinho removidos com sucesso.');
    
  });
});
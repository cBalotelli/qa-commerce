import { ApiSchema } from './ApiSchema';

class ApiService {
  constructor() {
    this.requestConfig = {}; // Guarda a requisição que está sendo montada
  }

  // Inicia a montagem buscando a API no Schema
  prepararRequisicao(nomeDaApi) {
    const api = ApiSchema[nomeDaApi];
    if (!api) throw new Error(`A API '${nomeDaApi}' não foi encontrada no ApiSchema.js`);

    this.requestConfig = {
      method: api.method,
      url: api.endpoint, // Ex: '/api/carrinho/{userId}'
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      failOnStatusCode: false // Fundamental para testarmos erros (400, 404, 500)
    };
  }

  //Substitui os parâmetros na URL (Ex: troca {userId} por 1)
  adicionarParametroDeRota(chave, valor) {
    this.requestConfig.url = this.requestConfig.url.replace(`{${chave}}`, valor);
  }

  // Adiciona o Body (para POST/PUT)
  adicionarPayload(body) {
    this.requestConfig.body = body;
  }

  // Dispara a requisição e salva a resposta nativamente no Cypress
  enviarRequisicao() {
    cy.request(this.requestConfig).as('apiResponse');
  }
}

export default new ApiService();
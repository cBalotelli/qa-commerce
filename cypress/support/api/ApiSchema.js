/**
 * ApiSchema
 * ------
 * Dicionário centralizado de APIs. 
 * Aqui o BDD vai usar um argumento(ex: 'Adicionar itens ao carrinho') 
 * para descobrir qual método e endpoint deve chamar.
 */


export const ApiSchema = {
  'Adicionar itens ao carrinho': {
    method: 'POST',
    endpoint: '/api/carrinho',
  },
  'Listar itens do carrinho': {
    method: 'GET',
    endpoint: '/api/carrinho/{userId}', 
  },
  'Esvaziar carrinho':{
    method: 'DELETE',
    endpoint: 'api/carrinho/{userId}'
  }

  
};
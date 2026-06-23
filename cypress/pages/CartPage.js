import BasePage from './BasePage';

class CartPage extends BasePage {

  // --- Mapeamento de Elementos ---
  elements = {
    btnAdicionarProduto: () => cy.get('.card > .card-body > .btn'),
    contadorCarrinho: () => cy.get('#cart-count'),
    navLinkCarrinho: () => cy.get('.nav-link').contains('CARRINHO'),
    
    // Usando a classe 100% segura do HTML
    btnRemover: () => cy.get(".remove-from-cart"),
    
    listaItens: () => cy.get('.cart-item'),
    precoUnitario: () => cy.get('.cart-item > :nth-child(2)'),
    quantidadeItem: () => cy.get('.cart-item > :nth-child(3)'),
    precoTotal: () => cy.get('.cart-item > :nth-child(4)')
  }

  // --- Ações ---

  visitHome() {
    this.visit('/'); 
  }

  adicionarProdutoAoCarrinho(index = 0) {
    this.elements.btnAdicionarProduto().eq(index).click();
    this.elements.contadorCarrinho().should('not.have.text', '0');
  }

  acessarCarrinho() {
    this.elements.navLinkCarrinho().click();
    this.elements.listaItens().should('exist'); 
  }

  removerProdutoDoCarrinho(index = 0) {
    this.elements.btnRemover().eq(index).click();
  }

  adicionarProdutosAleatorios(quantidade = 2) {
    cy.visit('/');
    this.elements.btnAdicionarProduto().then(($botoes) => {
      const totalDeProdutos = $botoes.length;
      const indicesSorteados = Cypress._.sampleSize(Cypress._.range(totalDeProdutos), quantidade);

      indicesSorteados.forEach((index) => {
        cy.wrap($botoes.eq(index)).click();
        this.elements.contadorCarrinho().should('not.have.text', '0');
      });
    });
  }

  irParaCheckout() {
    // Clica no botão usando o texto dele (muito mais seguro que classes genéricas como .btn)
    cy.contains('a', 'Ir para o Checkout').click();
    
    // Trava de segurança: garante que a URL mudou para a tela de checkout
    // Ajuste o texto '/checkout' se a sua URL real for diferente
    cy.url().should('include', '/checkout'); 
  }

  capturarDadosDosProdutosNaTela() {
    const itensNaTela = [];

    return this.elements.listaItens().then(($listaDeItens) => {
      
      // Itera dinamicamente sobre quantos produtos existirem na tela (1, 3, 9...)
      $listaDeItens.each((index, elementoHtml) => {
        const $el = Cypress.$(elementoHtml); // Transforma em objeto jQuery para facilitar a busca

        // Captura e limpa o Nome (via <legend>)
        const nome = $el.find('legend').text().trim();
        
        // Captura e converte o Preço para Float
        const textoPreco = $el.find('p:contains("Preço:")').text();
        const preco = parseFloat(textoPreco.replace(/[^\d.]/g, ''));
        
        // Captura e converte a Quantidade para Inteiro
        const textoQtd = $el.find('p:contains("Quantidade:")').text();
        const quantidade = parseInt(textoQtd.replace(/[^\d]/g, ''), 10);

        // Monta o objeto com a mesma estrutura (chaves) que a API retorna e salva no Array
        itensNaTela.push({ name: nome, price: preco, quantity: quantidade });
      });

      // Devolve o Array com todos os produtos da tela
      return itensNaTela; 
    });
  }

  // --- Validações ---
  
  verificarSeProdutoEstaListado() {
    this.elements.listaItens().should('have.length.at.least', 1);
  }

  verificarCarrinhoVazio() {
    this.elements.listaItens().should('not.exist');
  }

  verificarValorTotalZero() {
    cy.reload();
    this.elements.contadorCarrinho().should('have.text', '0');
  }

  // O método que resolve a Auditoria do Balão
  validarSincroniaDeQuantidadesNoBalao() {
    let somaQuantidadesNaTela = 0;

    this.elements.listaItens().each(($item) => {
      // Pega o texto de quantidade de cada linha
      const textoQtd = $item.find('p:contains("Quantidade:")').text();
      const qtdUnidades = parseInt(textoQtd.replace(/\D/g, ''), 10);
      
      // Soma as unidades
      somaQuantidadesNaTela += qtdUnidades;
    }).then(() => {
      // Confere se o balão lá em cima exibe a soma correta
      this.elements.contadorCarrinho().invoke('text').then((textoBalao) => {
        const qtdBalao = parseInt(textoBalao.replace(/\D/g, ''), 10);
        expect(qtdBalao).to.eq(
          somaQuantidadesNaTela, 
          'Bug: O contador do balão não bate com as unidades listadas!'
        );
      });
    });
  }

  // Auditoria de Valores
  validarSomaTotalDoCarrinhoDinamica() {
    let somaCalculada = 0;

    this.elements.listaItens().each(($item) => {
      const textoTotalItem = $item.find('p:contains("Total:")').text();
      const valorItem = parseFloat(textoTotalItem.replace(/[^\d.]/g, ''));
      
      somaCalculada += valorItem;
    }).then(() => {
      cy.get('#total-products').invoke('text').then((textoTotalGeral) => {
        const totalGeralExibido = parseFloat(textoTotalGeral.replace(/[^\d.]/g, ''));
        expect(totalGeralExibido).to.eq(somaCalculada);
      });
    });
  }
}

export default new CartPage();
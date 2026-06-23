import cartPage from '../pages/CartPage';
import checkoutPage from '../pages/CheckoutPage';

/**
 * ShoppingFlow (Actions / Flow layer)
 * -------------------------------------
 * POR QUE ESSE ARQUIVO EXISTE:
 * Um Page Object só deveria conhecer a SUA PRÓPRIA tela. Mas vários
 * cenários de checkout precisam, antes de tudo, passar pelo carrinho
 * (adicionar produto -> abrir carrinho -> ir para checkout).
 *
 * Se essa sequência de 3 passos fosse repetida dentro de cada step de
 * checkout, qualquer mudança nesse fluxo (ex: a loja passa a exigir um
 * clique extra) obrigaria editar N arquivos de step diferentes.
 *
 * Por isso ela mora aqui: um único lugar que ORQUESTRA dois Page Objects
 * diferentes para representar um fluxo de negócio completo. Os steps
 * chamam esse fluxo, e não os Page Objects de carrinho/checkout
 * diretamente, sempre que precisarem "chegar" no checkout.
 */
class ShoppingFlow {
addProductsAndGoToCheckout(productIndex = 1, quantity = 1) {
    cartPage.visitHome();

    for (let i = 0; i < quantity; i += 1) {
      cartPage.adicionarProdutoAoCarrinho(productIndex);
    }

    // Abre o carrinho usando o novo método simples que criamos
    cartPage.acessarCarrinho(); 
    
    // Clica no botão de ir para o checkout nativamente (KISS)
    cy.get('#totals > .btn').click(); 
  }

  
}

// Exporta pronto para uso nos steps
export default new ShoppingFlow();
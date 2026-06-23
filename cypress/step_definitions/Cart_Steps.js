import { Given, When,Then, Before, After,} from "@badeball/cypress-cucumber-preprocessor";
import cartPage from "../pages/CartPage";
import CartPage from "../pages/CartPage";
import apiService from '../support/api/ApiService.js';



// Variável global para compartilhar a informação entre os passos do mesmo cenário
let quantidadeSorteadaNesteCenario = 0;

function limparCarrinhoSequencialmente() {
  cy.get("body").then(($body) => {
    // seletor HTML
    if ($body.find(".remove-from-cart").length > 0) {
      // Clica apenas no primeiro botão da lista
      cartPage.elements.btnRemover().first().click();
      // um pequeno wait para o front-end não quebrar entre os cliques
      cy.wait(300);
      // Chama a si mesma novamente para ver se ainda sobrou algum botão na tela
      limparCarrinhoSequencialmente();
    }
  });
}
Before(
  {
    tags: "@BeforeCarrinhoVazio",
  },
  () => {
    cy.visit("/");

    // Em vez de confiar no balãozinho da Home (que tem delay),
    // vamos direto para a fonte da verdade: a tela do carrinho
    cartPage.elements.navLinkCarrinho().click();

    // Como o Cypress aguarda a tela carregar, agora chamamos a função destruidora
    limparCarrinhoSequencialmente();

    // Com o carrinho vazio com sucesso, voltamos para a Home para começar o cenário
    cy.visit("/");
  },
);

// --- Setup / navegação ---

Given("que o usuário está na página inicial da loja", () => {
  cartPage.visitHome();
});

Given("que o carrinho esta vazio", () => {
  // Como o Hook @prepararCarrinhoVazio já fez o trabalho duro,
  // aqui nós só confirmamos visualmente que o balão está zero.
  cy.get("#cart-count").should("have.text", "0");
});

Given("que o usuário possui um produto no carrinho", () => {
  cy.visit("/");
  cartPage.adicionarProdutoAoCarrinho(0);

  // É fundamental já deixar o usuário na tela do carrinho
  // para que o próximo passo (When) consiga clicar no botão "Remover"
  cartPage.acessarCarrinho();
});

// --- Ações ---

When("o usuário adiciona o primeiro produto ao carrinho", () => {
  // Index 0 representa o primeiro produto da lista
  cartPage.adicionarProdutoAoCarrinho(0);
});

When("o usuário remove o produto do carrinho", () => {
  cartPage.removerProdutoDoCarrinho(0);
});

When("o usuário adiciona dois produtos diferentes ao carrinho", () => {
  //O argumento index é a quantidade de produtos a serem 'sorteados' para adicionar no carrinho
  cartPage.adicionarProdutosAleatorios(2);
});

When("o usuário adiciona multiplos produtos diferentes ao carrinho", () => {
  // Sorteia um número de 3 a 9
  quantidadeSorteadaNesteCenario = Cypress._.random(3, 9);

  // Manda a CartPage adicionar exatamente essa quantidade de produtos únicos
  cartPage.adicionarProdutosAleatorios(quantidadeSorteadaNesteCenario);
});

// --- Validações ---

Then("o produto deve ser listado no carrinho", () => {
  // Validação visual básica e acesso
  cartPage.acessarCarrinho();
  cartPage.verificarSeProdutoEstaListado();

  // Captura todos os produtos renderizados no Front-end
  cartPage.capturarDadosDosProdutosNaTela().then((dadosDoFront) => {
    // Prepara e dispara a API usando Orquestrador
    apiService.prepararRequisicao("Listar itens do carrinho");
    apiService.adicionarParametroDeRota("userId", "1");
    apiService.enviarRequisicao();

    // Audita a integridade Front vs Back
    cy.get("@apiResponse").then((response) => {
      const dadosDaApi = response.body;

      // A quantidade de itens totais precisa ser idêntica
      expect(dadosDaApi.length).to.eq(dadosDoFront.length,"Quantidade de itens correspondente Front x API", "A quantidade de itens na Tela é diferente da resposta da API!");
      

      // Faz um loop por todos os produtos capturados na tela
      dadosDoFront.forEach((itemFront) => {
        // Procura na API o produto que tem o mesmo nome que está na tela
        const itemApi = dadosDaApi.find(
          (apiObj) => apiObj.name === itemFront.name,
        );

        // Valida se o produto da tela realmente foi devolvido pelo Back-end
        expect(itemApi).to.not.be.undefined;

        // Compara matematicamente o Preço e a Quantidade
        expect(itemApi.price).to.eq(
          itemFront.price,
          `Nenhuma divergência de preço encontrada no produto: ${itemFront.name}`, "Divergência no preço de produto encontrada!"
        );

        expect(itemApi.quantity).to.eq(
          itemFront.quantity,
          `Nenhuma divergencia de quandidade encontrada no produto: ${itemFront.name}`, "Divergencia de quandidade encontrada no produto"
        );
      });

      // Se o código chegar aqui sem estourar nenhum 'expect', o teste passa
      cy.log("✅ Validação Front vs API OK");
    });
  });
});

Then("o valor total deve corresponder ao preço do produto", () => {
  // Como o passo anterior já abriu o carrinho, basta validar o cálculo
  cartPage.validarSomaTotalDoCarrinhoDinamica(0);
});

Then("o carrinho deve ficar vazio", () => {
  cartPage.verificarCarrinhoVazio();
});

Then("o valor total deve ser zero", () => {
  cartPage.verificarValorTotalZero();
});

Then("o carrinho deve exibir os dois produtos", () => {
  cartPage.acessarCarrinho();
  cy.get(".cart-item").should("have.length", 2);
});

Then("o valor total deve ser a soma dos preços dos produtos", () => {
  // Chama a lógica de soma dinâmica
  cartPage.validarSomaTotalDoCarrinhoDinamica();
});

Then(
  "o carrinho deve exibir a quantidade exata de produtos adicionados",
  () => {
    cartPage.acessarCarrinho();

    // A validação usa a variável que é guardado no passo anterior
    // Se ele sorteou 4, ele vai garantir que existem exatos 4 itens '.cart-item' listados.
    cy.get(".cart-item").should("have.length", quantidadeSorteadaNesteCenario);
  },
);

Then(
  "o valor total deve ser a soma dos preços de todos os produtos no carrinho",
  () => {
    // Ela vai varrer a tela inteira, não importa se tem 3 ou mais itens
    cartPage.validarSomaTotalDoCarrinhoDinamica();
  },
);

// --- HOOK DE LIMPEZA (TEARDOWN) ---
// O hook vai rodar em todos os cenários, exceto os que tiverem a tag @skipTeardown
After({ tags: "not @skipTeardown" }, () => {
  cy.visit("/");
  // Entra no carrinho
  cy.get(".nav-link").contains("CARRINHO").click();
  limparCarrinhoSequencialmente();
});

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

import cartPage from "../pages/CartPage.js";
import checkoutPage from "../pages/CheckoutPage";

import {
  generateUser,
  generateCreditCard,
  generatePassword,
} from "../support/utils/Faker_Helper";

Given("que o usuário está na tela de carrinho", () => {
  cy.visit("/");
});

Given("possui um ou mais produtos no carrinho", () => {
  cartPage.adicionarProdutosAleatorios(1);
  cartPage.acessarCarrinho();
});

Given("acessou a página de checkout", () => {
  cartPage.irParaCheckout();
});

// --- Ações ---

When("o usuário preenche todos os campos obrigatórios", () => {
  const usuarioMock = {
    nome: "Cypress",
    sobrenome: "Automation",
    endereco: "Rua das Validações",
    numero: "404",
    cep: "01234567",
    email: "cypress@ecommerce.com",
  };
  checkoutPage.preencherDadosObrigatorios(usuarioMock);
});

When("seleciona o método de pagamento {string}", (metodoDePagamento) => {
  // Se no BDD estiver "boleto", a variável metodoDePagamento valerá "boleto"
  checkoutPage.selecionarMetodoDePagamento(metodoDePagamento);
});

When("preenche os dados do cartão", () => {
  // Objeto simples com os dados fictícios do cartão
  const cartaoMock = {
    numero: "1234567812345678",
    validade: "12/30",
    cvc: "123",
  };

  checkoutPage.preencherDadosDoCartao(cartaoMock);
});

When("aceita os termos", () => {
  checkoutPage.aceitarTermos();
});

When("confirma o pedido", () => {
  checkoutPage.confirmarPedido();
});

When('o usuário deixa de preencher um campo obrigatório aleatório', () => {
  const usuarioMock = {
    nome: 'Cypress',
    sobrenome: 'Automation',
    endereco: 'Rua das Validações',
    numero: '404',
    cep: '01234567',
    email: 'cypress@ecommerce.com'
  };

  // Chama a nova função que vai omitir um campo randomicamente
  checkoutPage.preencherDadosOmitindoUmCampoAleatorio(usuarioMock);
});

// --- Validações ---

Then("o sistema deve exibir uma mensagem de sucesso", () => {
  checkoutPage.validarMensagemDeSucesso();
});

Then("o sistema deve exibir a tela do status do pedido", () => {
  checkoutPage.validarTelaStatusPedido();
});

Then("o id do pedido é exibido", () => {
  checkoutPage.validarIdDoPedidoExibido();
});

Then("status do pagamento aprovado", () => {
  checkoutPage.validarStatusPagamentoAprovado();
});


Then('o sistema deve bloquear o envio do pedido', () => {
  checkoutPage.validarPedidoNaoConcluido();
});

Then('deve exibir um alerta de erro no formulário', () => {
  checkoutPage.validarAlertaDeCampoObrigatorio();
});
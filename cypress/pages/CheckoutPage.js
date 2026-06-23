class CheckoutPage {
  // --- Mapeamento de Elementos ---
  elements = {
    // Dados Pessoais
    inputNome: () => cy.get("#first-name"),
    inputSobrenome: () => cy.get("#last-name"),
    inputEndereco: () => cy.get("#address"),
    inputNumero: () => cy.get("#number"),
    inputCep: () => cy.get("#cep"),
    inputEmail: () => cy.get("#email"),

    // Pagamento
    // Nota: Seletores com nth-child podem ser frágeis. Se o dev colocar IDs (ex: #radio-boleto) depois, é só trocar aqui!
    radioCartao: () => cy.get(':nth-child(2) > [name="payment-method"]'),
    radioBoleto: () => cy.get(':nth-child(3) > [name="payment-method"]'),
    radioPix: () => cy.get(':nth-child(4) > [name="payment-method"]'),
    // Dados do Cartão
    inputNumeroCartao: () => cy.get("#card-number"),
    inputValidadeCartao: () => cy.get("#card-expiry"),
    inputCvcCartao: () => cy.get("#card-cvc"),

    // Termos e Confirmação
    checkboxTermos: () => cy.get('[name="terms"]'),
    // Botão finalizar Pedido
    btnConfirmarPedido: () => cy.get(".btn"),
    // Status do pedido
    painelStatusPedido: () => cy.get("#order-status"),
    // ID do pedido
    textoIdPedido: () => cy.get("#order-status > :nth-child(2)"),
  };

  // --- Ações ---

  preencherDadosObrigatorios(usuario) {
    // Código linear e explícito. O .clear() evita sujeira de lixo na sessão
    this.elements.inputNome().clear().type(usuario.nome);
    this.elements.inputSobrenome().clear().type(usuario.sobrenome);
    this.elements.inputEndereco().clear().type(usuario.endereco);
    this.elements.inputNumero().clear().type(usuario.numero);
    this.elements.inputCep().clear().type(usuario.cep);
    this.elements.inputEmail().clear().type(usuario.email);
  }

  selecionarMetodoDePagamento(metodo) {
    // Usamos .check() em radio buttons (é mais seguro que o .click() no Cypress)
    if (metodo.toLowerCase() === "boleto") {
      this.elements.radioBoleto().check();
    } else if (metodo.toLowerCase() === "pix") {
      this.elements.radioPix().check();
    } else {
      this.elements.radioCartao().click();
    }
  }

  preencherDadosDoCartao(cartao) {
    // .clear() garante que não vai concatenar texto caso o campo já tenha algum lixo
    this.elements.inputNumeroCartao().clear().type(cartao.numero);
    this.elements.inputValidadeCartao().clear().type(cartao.validade);
    this.elements.inputCvcCartao().clear().type(cartao.cvc);
  }

  aceitarTermos() {
    // .check() é a validação nativa do Cypress para inputs do tipo radio/checkbox
    this.elements.checkboxTermos().check();
  }

  confirmarPedido() {
    this.elements.btnConfirmarPedido().click();
  }
  preencherDadosOmitindoUmCampoAleatorio(usuario) {
    // Colocamos apenas os campos OBRIGATÓRIOS aqui (telefone de fora)
    const camposObrigatorios = [
      {
        elemento: this.elements.inputNome,
        valor: usuario.nome,
      },
      {
        elemento: this.elements.inputSobrenome,
        valor: usuario.sobrenome,
      },
      {
        elemento: this.elements.inputEndereco,
        valor: usuario.endereco,
      },
      {
        elemento: this.elements.inputNumero,
        valor: usuario.numero,
      },
      {
        elemento: this.elements.inputCep,
        valor: usuario.cep,
      },
      {
        elemento: this.elements.inputEmail,
        valor: usuario.email,
      },
    ];

    // O Lodash escolhe UM campo aleatório dessa lista para ser o "esquecido" da vez
    const campoOmitido = Cypress._.sample(camposObrigatorios);

    // Iteramos sobre todos os campos
    camposObrigatorios.forEach((campo) => {
      if (campo === campoOmitido) {
        // Se for um dos outros, preenchemos normalmente
        campo.elemento().clear().type(campo.valor);
      }
    });

    // Opcional: faz um log no Cypress só para você saber qual campo foi omitido no teste
    cy.log("Campo omitido neste teste:", campoOmitido.elemento);
  }

  // --- Validações ---

  validarMensagemDeSucesso() {
    // Aqui usamos uma busca textual genérica para não depender de um seletor específico por enquanto.
    // Ele vai procurar a palavra "sucesso" em qualquer lugar visível da tela após clicar no botão.
    cy.contains("sucesso", {
      matchCase: false,
    }).should("be.visible");
  }

  validarTelaStatusPedido() {
    // Garante que o container final carregou e está visível na tela
    this.elements.painelStatusPedido().should("be.visible");
  }

  validarIdDoPedidoExibido() {
    // Valida duas coisas de uma vez: se o elemento está na tela e se ele não está vazio
    this.elements.textoIdPedido().should("be.visible").and("not.be.empty");
  }

  validarStatusPagamentoAprovado() {
    // Busca pelo texto exato dentro do painel para evitar falsos positivos
    this.elements
      .painelStatusPedido()
      .should("contain.text", "Status: Pagamento aprovado");
  }

  validarPedidoNaoConcluido() {
    // Se o pedido não foi concluído, o painel de status NÃO deve existir na tela
    this.elements.painelStatusPedido().should("not.exist");
  }

  validarAlertaDeCampoObrigatorio() {
    // Usamos diretamente a classe que você mapeou do HTML real!
    // Super seguro e não depende de hierarquias frágeis como "parent()".
    cy.get(".invalid-feedback")
      .should("be.visible")
      .and("contain.text", "Este campo é obrigatório.");
  }
}

export default new CheckoutPage();

# QA-Commerce

### Loja virtual Geek para simulação de testes 

## Clonando e executando em sua máquina

### Pré-requisito:

-Node.js - Você encontra em: https://nodejs.org/en/
-Visual Studio Code ( ou editor de sua prefrência) - você encontra em: https://code.visualstudio.com/download
-Git: você encontra em: https://git-scm.com/downloads

Via terminal, rode os seguintes comandos:
```  
git clone https://github.com/fabioaraujoqa/qa-commerce.git
```
```
cd qa-commerce
```

#### Para instalar as dependencias:
```
npm install 
```

#### Para subir o servidor e o banco:
```
npm start
```

No console vai aparecer os endereços do site e do banco. 
O site você acessaem: http://localhost:3000/

A documentação funciona em: http://localhost:3000/api-docs/


# Automação de Testes E2E e API (Híbridos)

Este projeto contém a suíte de testes automatizados para o fluxo de E-commerce (Carrinho e Checkout), englobando testes visuais (Web), testes de contrato de backend (API) e **testes híbridos** de integridade de dados (Front-end vs Back-end).

O framework foi arquitetado com base em princípios Sêniores de automação, utilizando **BDD (Behavior-Driven Development)**, **Page Object Model (POM)** e **Data-Driven API Routing**.

## Stack Tecnológica

- **[Cypress](https://www.cypress.io/):** Framework principal de testes (Web e rede).
- **[Cucumber / Gherkin](https://github.com/badeball/cypress-cucumber-preprocessor):** Escrita de cenários declarativos e reutilizáveis.
- **JavaScript:** Lógica de automação e orquestração.
- **Lodash / jQuery:** Para manipulação de dados e raspagem (scraping) de DOM.

## Destaques da Arquitetura

- **Testes Híbridos (Web + API):** Validação de ponta a ponta que garante que os dados exibidos na interface (ex: quantidade e preço no carrinho) são matematicamente idênticos aos dados persistidos no banco de dados através da API.
- **Motor Orquestrador de API (`ApiService.js`):** Um serviço centralizado que monta rotas, métodos e payloads dinamicamente com base em um dicionário de APIs (`ApiSchema.js`), eliminando a duplicação de requisições HTTP pelo código.
- **Independência de Estado:** Uso de funções recursivas e hooks (`Before`/`After`) para garantir que o ambiente seja limpo via UI ou API antes e depois de cada cenário, evitando falsos positivos.


## Execução

framework foi preparado para rodar de forma totalmente independente para validações finais, ou de forma segmentada para o dia a dia. Escolha a abordagem desejada:

### 1. Execução Automática em Um Clique (Modo CI/CD)
Liga o servidor, roda todos os testes em background (headless) e derruba o servidor no final.

```bash
# Roda a suíte completa de forma automatizada
npm test

### 2. Execução Interativa (Modo Visual)

Para criar e debugar testes acompanhando o robô na interface do navegador.

### 1. Abra um terminal e inicie a aplicação web (mantenha minimizado)
npm start

### 2. Abra um SEGUNDO terminal e inicie o painel do Cypress
npm run cy:open

### 3. Execução de uma Feature Específica
Para rodar todos os cenários de um único arquivo sem abrir o navegador (requer o servidor da aplicação já rodando).

# Exemplo - Executa apenas os testes de Checkout
npm run cy:run -- --spec "cypress/e2e/features/Frontend/NomeDaFeature.feature"

### 4. Execução de um Teste Único via Tags
Para isolar um único cenário, adicione a tag @only diretamente acima da palavra Scenario no seu arquivo .feature e rode:

# Executa apenas o cenário com a tag correspondente
npx cypress run --env tags="@NomeCenário"

*Parceria: Fábio Araújo, Bruna Emerich e Tamara Fontanella







import './commands'
import 'cypress-plugin-api'

// Mantemos apenas o wait. Ele é útil porque força o Cypress a manter a tela aberta 
// por 3 segundos extras antes de finalizar o vídeo, garantindo que o "Status Final"
// (se passou ou falhou) fique visível no vídeo.
afterEach(function () {
  cy.wait(3000); 
});
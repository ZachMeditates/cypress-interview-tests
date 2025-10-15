describe('0. Startup Health Check', () => {
  it('should verify all services are running', () => {
    cy.visit('/')
    cy.contains('Welcome to Census Registration').should('be.visible')

    cy.task('queryDb', {
      query: 'SELECT 1 as test'
    }).then((result) => {
      expect(result.rows[0].test).to.eq(1)
    })

    cy.request({
      url: `${Cypress.env('apiUrl')}/auth/login`,
      method: 'POST',
      body: { email: 'test', password: 'test' },
      failOnStatusCode: false
    }).then((response) => {
      expect([401, 404]).to.include(response.status)
    })
  })
})
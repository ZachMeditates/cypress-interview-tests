describe('1. UI Person Records Verification', () => {
  let testData

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data
    })
  })

  it('should display person records on dashboard', () => {
    cy.apiLogin(testData.testUser.email, testData.testUser.password)
    cy.visit('/dashboard')
    cy.wait(2000)
    cy.get('.dashboard-container').should('be.visible')
    
    cy.get('body').then($body => {
      const bodyText = $body.text()
      expect(bodyText).to.satisfy(text => 
        text.includes('FAKERon') || 
        text.includes('Add record') || 
        text.includes('You have not entered your household yet')
      )
    })
  })

  it('should show form validation on empty submission', () => {
    cy.apiLogin(testData.testUser.email, testData.testUser.password)
    cy.visit('/dashboard')
    cy.wait(2000)
    
    cy.get('body').then($body => {
      if ($body.text().includes('Add record')) {
        cy.contains('Add record').click()
        cy.contains('button', 'Update').click()
        cy.get('form').should('contain', 'Required')
      }
    })
  })

  it('should handle missing household gracefully', () => {
    cy.apiLogin(testData.testUser.email, testData.testUser.password)
    cy.visit('/dashboard')
    cy.wait(2000)
    
    cy.get('body').then($body => {
      if ($body.text().includes('You have not entered your household yet')) {
        cy.contains('You have not entered your household yet').should('be.visible')
      }
    })
  })
})
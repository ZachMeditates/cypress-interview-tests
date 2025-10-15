Cypress.Commands.add('loginUser', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/auth/login')
    cy.wait(2000) // Wait for hydration
    cy.get('#email').should('not.be.disabled').clear().type(email)
    cy.get('#password').should('not.be.disabled').clear().type(password)
    cy.get('#login-button').click()
    
    // Wait for successful login - check for dashboard or any redirect
    cy.url({ timeout: 15000 }).should('satisfy', (url) => {
      return !url.includes('/auth/login') || url.includes('/dashboard')
    })
  }, {
    validate() {
      // Validate session by making API call instead of DOM check
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/record/user/email/${email}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 404])
      })
    }
  })
  
  // Visit dashboard after session is established
  cy.visit('/dashboard')
  cy.get('.dashboard-container', { timeout: 10000 }).should('be.visible')
})

Cypress.Commands.add('addHousehold', (householdData) => {
  cy.contains('Add household').click()
  cy.get('#address1').type(householdData.address)
  cy.get('#city').type(householdData.city)
  cy.get('#state').parent().click()
  cy.contains(householdData.state).click()
  cy.get('#zip').type(householdData.zipCode)
  cy.contains('button', 'Update').click()
})

Cypress.Commands.add('addPerson', (personData) => {
  cy.contains('Add record').click()
  cy.wait(1000)
  
  cy.get('form').within(() => {
    cy.get('input').eq(0).type(personData.firstName, { force: true })
    cy.get('input').eq(1).type(personData.lastName, { force: true })
    cy.get('input').eq(2).type(personData.dateOfBirth, { force: true })
    cy.get('input').eq(3).type(personData.phoneNumber, { force: true })
    cy.get('input[value="MALE"]').click({ force: true })
  })
  
  cy.contains('button', 'Update').click({ force: true })
  cy.wait(2000)
})

Cypress.Commands.add('apiLogin', (email, password) => {
  return cy.request({
    method: 'POST',
    url: 'http://localhost:3000/api/auth/login',
    body: {
      email: email,
      password: password
    },
    failOnStatusCode: false,
    timeout: 10000
  })
})

Cypress.Commands.add('getPersonRecords', (email) => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/record/user/email/${email}`
  })
})

Cypress.Commands.add('updatePerson', (personData) => {
  cy.get('[data-testid="edit-person"]').first().click()
  cy.get('[data-testid="firstName"]').clear().type(personData.firstName)
  cy.get('[data-testid="lastName"]').clear().type(personData.lastName)
  cy.get('[data-testid="phoneNumber"]').clear().type(personData.phoneNumber)
  cy.get('[data-testid="update-person"]').click()
})

Cypress.Commands.add('deletePerson', () => {
  cy.get('[data-testid="delete-person"]').first().click()
  cy.get('[data-testid="confirm-delete"]').click()
})

Cypress.Commands.add('savePersonToStorage', (personData) => {
  cy.window().then((win) => {
    if (!win.dataStorage) {
      win.dataStorage = { persons: [] }
    }
    win.dataStorage.persons.push({
      ...personData,
      createdAt: new Date().toISOString()
    })
  })
})

Cypress.Commands.add('getPersonFromStorage', (firstName, lastName) => {
  return cy.window().then((win) => {
    if (win.dataStorage && win.dataStorage.persons) {
      return win.dataStorage.persons.find(p => 
        p.firstName === firstName && p.lastName === lastName
      )
    }
    return null
  })
})
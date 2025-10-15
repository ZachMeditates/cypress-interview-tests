import './commands'

// Handle uncaught exceptions in headless mode
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignore Next.js server action errors in headless mode
  if (err.message.includes('An unexpected response was received from the server')) {
    return false
  }
  if (err.message.includes('fetchServerAction')) {
    return false
  }
  // Ignore NEXT_REDIRECT errors
  if (err.message.includes('NEXT_REDIRECT')) {
    return false
  }
  // Ignore hydration mismatch errors
  if (err.message.includes('Hydration failed')) {
    return false
  }
  if (err.message.includes('hydration')) {
    return false
  }
  return true
})

// Add viewport configuration for headless mode
beforeEach(() => {
  cy.viewport(1280, 720)
})
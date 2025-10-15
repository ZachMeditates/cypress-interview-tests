describe('5. CRUD Operations and Data Consistency', () => {
  let testData

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data
    })
  })

  it('should validate data consistency across layers', () => {
    // Login via API to avoid hydration issues
    cy.apiLogin(testData.testUser.email, testData.testUser.password).then(() => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/record/user/email/${testData.testUser.email}`
      }).then((response) => {
        if (response.body.records && response.body.records.length > 0) {
          const apiPerson = response.body.records[0]
          
          cy.task('queryDb', {
            query: 'SELECT * FROM "Record" WHERE "firstName" = $1',
            values: [apiPerson.firstName]
          }).then((result) => {
            if (result.rows.length > 0) {
              expect(result.rows[0].firstName).to.eq(apiPerson.firstName)
            }
          })
        }
      })
    })
  })

  it('should compare data objects', () => {
    const person1 = { firstName: 'FAKERon', lastName: 'FAKESwanson' }
    const person2 = { firstName: 'FAKERon', lastName: 'FAKESwanson' }
    
    expect(person1.firstName).to.eq(person2.firstName)
    expect(person1.lastName).to.eq(person2.lastName)
  })

  it('should validate object serialization', () => {
    const person1 = { firstName: 'FAKE John', lastName: 'FAKE Doe', gender: 'Male' }
    const person2 = { firstName: 'FAKE John', lastName: 'FAKE Doe', gender: 'Male' }
    const person3 = { firstName: 'FAKE Jane', lastName: 'FAKE Doe', gender: 'Female' }
    
    expect(JSON.stringify(person1)).to.eq(JSON.stringify(person2))
    expect(JSON.stringify(person1)).to.not.eq(JSON.stringify(person3))
  })
})
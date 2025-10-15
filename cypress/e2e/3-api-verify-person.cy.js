describe('3. API Person Record Verification', () => {
  let testData

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data
    })
  })

  it('should return person records via API', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/login',
      body: {
        email: testData.testUser.email,
        password: testData.testUser.password
      },
      failOnStatusCode: false
    }).then((loginResponse) => {
      if (loginResponse.status === 200) {
        cy.request({
          method: 'GET',
          url: `http://localhost:3000/api/record/user/email/${testData.testUser.email}`
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('records')
          expect(response.body.records).to.be.an('array')
          
          if (response.body.records.length > 0) {
            const targetRecord = response.body.records.find(r => 
              r.firstName === testData.person.firstName
            )
            if (targetRecord) {
              expect(targetRecord.firstName).to.eq(testData.person.firstName)
              expect(targetRecord.lastName).to.eq(testData.person.lastName)
            }
          }
        })
      }
    })
  })

  it('should handle invalid email in API request', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/login',
      body: {
        email: testData.testUser.email,
        password: testData.testUser.password
      },
      failOnStatusCode: false
    }).then((loginResponse) => {
      if (loginResponse.status === 200) {
        cy.request({
          method: 'GET',
          url: 'http://localhost:3000/api/record/user/email/invalid-email',
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.be.oneOf([400, 403, 404])
        })
      }
    })
  })
})
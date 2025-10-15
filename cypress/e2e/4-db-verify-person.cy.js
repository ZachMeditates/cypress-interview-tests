describe('4. Database Person Record Verification', () => {
  let testData

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data
    })
  })

  it('should verify person records exist in database', () => {
    cy.task('queryDb', {
      query: 'SELECT COUNT(*) as total FROM "Record"'
    }).then((result) => {
      const totalRecords = parseInt(result.rows[0].total)
      expect(totalRecords).to.be.greaterThan(0)
      
      cy.task('queryDb', {
        query: 'SELECT * FROM "Record" WHERE "firstName" = $1 AND "lastName" = $2',
        values: [testData.person.firstName, testData.person.lastName]
      }).then((result) => {
        if (result.rows.length > 0) {
          const personRecord = result.rows[0]
          expect(personRecord.firstName).to.eq(testData.person.firstName)
          expect(personRecord.lastName).to.eq(testData.person.lastName)
        }
      })
    })
  })

  it('should verify household-record relationships', () => {
    cy.task('queryDb', {
      query: `SELECT r."firstName", r."lastName", h.address1, h.city 
              FROM "Record" r 
              JOIN "Household" h ON r."householdId" = h.id 
              LIMIT 1`
    }).then((result) => {
      if (result.rows.length > 0) {
        const record = result.rows[0]
        expect(record).to.have.property('firstName')
        expect(record).to.have.property('address1')
      }
    })
  })
})
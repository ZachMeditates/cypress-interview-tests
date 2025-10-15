const { Client } = require('pg')
require('dotenv').config()

module.exports = {
  projectId: 'j2q6pk',
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    env: {
      apiUrl: process.env.CYPRESS_API_URL || 'http://localhost:3000/api',
      testUser: {
        email: process.env.TEST_USER_EMAIL || 'fake.test@example.com',
        password: process.env.TEST_USER_PASSWORD || '123456'
      }
    },
    setupNodeEvents(on, config) {
      on('task', {
        queryDb({ query, values = [] }) {
          const client = new Client({
            host: process.env.CYPRESS_DB_HOST || 'localhost',
            port: process.env.CYPRESS_DB_PORT || 5432,
            database: process.env.CYPRESS_DB_NAME || 'census_app',
            user: process.env.CYPRESS_DB_USER || 'postgres',
            password: process.env.CYPRESS_DB_PASSWORD || 'postgres'
          })
          
          return client.connect()
            .then(() => client.query(query, values))
            .then((result) => {
              client.end()
              return result
            })
            .catch((error) => {
              client.end()
              throw error
            })
        }
      })
    }
  }
}
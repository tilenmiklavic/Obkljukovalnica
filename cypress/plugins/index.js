/// <reference types="cypress" />

// dotenv.config()
const dotenvPlugin = require('cypress-dotenv');

module.exports = (on, config) => {
  config = dotenvPlugin(config)
  // ...
  config.env.googleRefreshToken = process.env.GOOGLE_REFRESH_TOKEN
  config.env.googleClientId = process.env.APP_GOOGLE_CLIENTID
  config.env.googleClientSecret = process.env.APP_GOOGLE_CLIENT_SECRET

  // plugins code ...

  return config
}

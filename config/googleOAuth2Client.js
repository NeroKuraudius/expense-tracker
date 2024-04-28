require('dotenv').config()

const {google} = require('googleapis')

const googleOAuth2Client = new google.auth.OAuth2(
  process.env.mailerID,
  process.env.mailerSecret,
  process.env.mailerCB
)


module.exports = googleOAuth2Client
const express = require('express')
const router = express.Router()
const passport = require('passport')
const googleOAuth2Client = require('../../config/googleOAuth2Client')
const nodemailer = require('nodemailer')

// 向FB發出資料請求
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))


// 用FB發回的資料進行登入驗證
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// 建立google mail URL
router.get('/google', (req, res) => {
  const authUrl = googleOAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://mail.google.com/']
  })

  return res.redirect(authUrl)
})

// 用取得的url進行callback
router.get('/google/callback', async (req, res) => {
  const { code } = req.query
  try {
    const { tokens } = await googleOAuth2Client.getToken(code)
    req.session.tokens = tokens

    return res.redirect('/email/user')
  } catch (err) {
    console.log('Error authenticating with Google:', err)
    return res.status(500).send('Error authenticating with Google.')
  }
})

module.exports = router
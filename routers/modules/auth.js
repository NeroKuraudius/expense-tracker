const express = require('express')
const router = express.Router()
const passport = require('passport')


// 向FB發出資料請求
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

// 用FB發回的資料進行登入驗證
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))


module.exports = router
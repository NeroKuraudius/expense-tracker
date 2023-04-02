const express = require('express')
const router = express.Router()
const passport = require('passport')
const flash = require('connect-flash')

// 登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

// 登入驗證
router.post('/', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// 註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

// 註冊
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  if (!name || !email || !password || !confirmPassword) {

  }
})

// 登出
router.get('/logout', (req, res, next) => {
  req.logOut((err) => {
    if (err) { return next(err) }
    flash('successMsg', 'Succeed in logout.')
    res.redirect('/users/login')
  })
})


module.exports = router
const express = require('express')
const router = express.Router()
const passport = require('passport')
const flash = require('connect-flash')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')

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
  const errs = []

  if (!name || !email || !password || !confirmPassword) {
    errs.push({ warningMsg: 'All of the blanks are required.' })
  }
  if (password !== confirmPassword) {
    errs.push({ warningMsg: 'The password are different.' })
  }
  if (errs.length) {
    return res.render('register', {
      errs, name, email, password, confirmPassword
    })
  }

  User.findOne(email)
    .lean()
    .then(user => {
      if (user) {
        errs.push({ warningMsg: 'This email had been registered.' })
        res.render('register', {
          errors, name, email, password, confirmPassword
        })
      }
      return bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name, email, password: hash
        }))
        .then(() => {
          req.flash('successMsg', 'Please use the new account to login.')
          res.redirect('/users/login')
        })
        .catch(err => console.log(error))
    })
    .catch(err => console.log(err))
})

// 登出
router.get('/logout', (req, res, next) => {
  req.logOut((err) => {
    if (err) { return next(err) }
    req.flash('successMsg', 'Succeed in logout.')
    res.redirect('/users/login')
  })
})


module.exports = router
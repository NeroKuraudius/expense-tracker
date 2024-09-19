const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')

// 登入頁面
router.get('/login', (req, res) => {
  return res.render('login')
})

// 登入驗證
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

// 註冊頁面
router.get('/register', (req, res) => {
  return res.render('register')
})

// 註冊
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errs = []

  if (!name || !email || !password || !confirmPassword) {
    errs.push({ errMsg: '所有欄位皆為必填' })
  }
  if (password !== confirmPassword) {
    errs.push({ errMsg: '所輸入的密碼不一致' })
  }
  if (errs.length) {
    return res.render('register', {
      errs, name, email, password, confirmPassword
    })
  }

  User.findOne({ email })
    .lean()
    .then(user => {
      if (user) {
        errs.push({ errMsg: '該帳號已註冊' })
        return res.render('register', {
          errs, name, email, password, confirmPassword
        })
      }
      return bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name, email, password: hash
        }))
        .then(() => {
          req.flash('successMsg', '請用新帳號重新登入')
          return res.redirect('/users/login')
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

// 登出
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err) }
    req.flash('successMsg', '您已成功登出')
    return res.redirect('/users/login')
  })
})

// 設定修改頁面
router.get('/setting', (req, res, next) => {
  return res.render('setting', { user : req.user })
})

// 修改設定
router.post('/setting', (req, res, next) => {
  


  req.flash('successMsg', '資料修改成功')
  return res.redirect('/users/setting')
})


module.exports = router

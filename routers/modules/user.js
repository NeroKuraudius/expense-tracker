const express = require('express')
const router = express.Router()
const passport = require('passport')

const { authenticator } = require('../../middleware/auth')
const userController = require('../../controllers/userController')

// 登入頁面
router.get('/login', (req, res) => { return res.render('login') })

// 註冊頁面
router.get('/register', (req, res) => { return res.render('register') })

// 設定修改頁面
router.get('/setting', authenticator, (req, res) => { return res.render('setting', { user : req.user }) })

// 登出
router.get('/logout', authenticator, userController.getLogout)

// 註冊
router.post('/register', userController.postRegister)

// 修改設定
router.post('/setting', authenticator, userController.postSetting)

// 登入驗證
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))


module.exports = router
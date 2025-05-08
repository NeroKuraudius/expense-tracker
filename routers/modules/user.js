const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')

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

// 登入驗證
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

// 註冊
router.post('/register', userController.postRegister)


// 修改設定
router.post('/setting', (req, res, next) => {
  let { name, budget, password } = req.body

  if (name.trim().length === 0) {
    req.flash('warningMsg', '姓名不可為空')
    return res.redirect('/users/setting')
  }

  if (!budget || budget === 0){
    budget = null
  }

  const email = req.user.email
  User.findOne({ email })
  .lean()
  .then(user=>{
    return bcrypt.compare(password, user.password)
        .then(async(isMatch)=>{
          if (isMatch){
            await User.updateOne({ email }, {$set: { name, budget } })
          }else{
            req.flash('warningMsg', '密碼輸入錯誤')
            return res.redirect('/users/setting')
          }
        })
        .then(() => {
          req.flash('successMsg', '資料修改成功')
          return res.redirect('/users/setting')
        })
        .catch(err => console.log(err))
  })
  .catch(err => console.log(err))
})


module.exports = router
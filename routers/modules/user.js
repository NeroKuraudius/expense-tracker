const express = require('express')
const router = express.Router()


// 登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

// 登入驗證
router.post('/',)

// 註冊頁面
router.get('/register',(req,res)=>{
  res.render('register')
})

// 註冊
router.post('/register',(req,res)=>{
  
})


module.exports = router
const express = require('express')
const exphbs = require('express-handlebars')
const router = require('./routers')
const methodOverride = require('method-override')
const session = require('express-session')
const usePassport = require('./config/passport')
const flash = require('connect-flash')
require('./config/mongoose')

const app = express()
const port = process.env.PORT

// 處理body-paser
app.use(express.urlencoded({ extended: true }))

// 設定樣板
app.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }))
app.set('view engine', 'hbs')

// 設定路由驅動器
app.use(methodOverride('_method'))

// 設定金鑰
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
  // ,cookie:{secure:false}
}))

// 設定驗證流程
usePassport(app)

// 使用flash作為提示訊息
app.use(flash())

// 將req變數帶入res中
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.successMsg = req.flash('successMsg')
  res.locals.warningMsg = req.flash('warningMsg')
  next()
})

// 設定各路由入口
app.use(router)

app.listen(port, () => {
  console.log('Succeed in running.')
})
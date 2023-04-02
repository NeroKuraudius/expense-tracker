const express = require('express')
const exphbs = require('express-handlebars')
const router = require('./routers')
const methodOverride = require('method-override')
const session = require('express-session')
require('./config/mongoose')

const app = express()
const port = process.env.PORT

app.use(express.urlencoded({ extended: true }))

app.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }))
app.set('view engine', 'hbs')

app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:true
}))

app.use(router)

app.listen(port, () => {
  console.log('Succeed in running.')
})
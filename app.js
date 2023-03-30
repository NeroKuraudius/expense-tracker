const express = require('express')
const exphbs = require('express-handlebars')
const router = require('./routers')
const methodOverride = require('method-override')
require('./config/mongoose')

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))

app.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }))
app.set('view engine', 'hbs')

app.use(methodOverride('_method'))


app.use(router)

app.listen(port, () => {
  console.log('Succeed in running.')
})
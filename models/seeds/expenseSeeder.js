const bcrypt = require('bcryptjs')
const User = require('../User')
const Expense = require('../Expense')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const SEED_USER = {
  name: 'TEST',
  email: 'test@gmail.com',
  password: 'zzz123',
}

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('MongoDB error!')
})
db.once('open', () => {
  return bcrypt.genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => {
      User.create({
        name: SEED_USER.name,
        email: SEED_USER.email,
        password: hash
      })
        .then(() => {
          console.log('expenseSeeder running finished!')
          db.close()
          process.exit()
        }
        )
    })
    .catch(err => console.log('expense run failed.'))
})
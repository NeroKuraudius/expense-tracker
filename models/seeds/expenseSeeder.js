const bcrypt = require('bcryptjs')
const db = require('../../config/mongoose')
const User = require('../User')
const Expense = require('../Expense')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


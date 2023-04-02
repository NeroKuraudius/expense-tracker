const express = require('express')
const router = express.Router()

const { authenticator } = require('../middleware/auth')
const home = require('./modules/home')
const user = require('./modules/user')
const expense = require('./modules/expense')

router.use('/users', user)
router.use('/expense', authenticator, expense)
router.use('/', authenticator, home)

module.exports = router
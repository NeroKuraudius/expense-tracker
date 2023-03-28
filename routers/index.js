const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const user = require('./modules/user')
const expense = require('./modules/expense')

router.use('/users', user)
router.use('/', home)
router.use('/expense', expense)

module.exports = router
const express = require('express')
const router = express.Router()

const homeController = require('../../controllers/homeController')


// 首頁
router.get('/', homeController.getHome)


module.exports = router
const express = require('express')
const router = express.Router()

const homeController = require('../../controllers/homeController')


// 監控用: for cronitor
router.get('/healthz', homeController.healthCheck)

// 首頁
router.get('/', homeController.getHome)


module.exports = router
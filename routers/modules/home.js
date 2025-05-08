const express = require('express')
const router = express.Router()


const homeController = require('../../controllers/homeController')

// 首頁
router.get('/', homeController.getHome)

// 顯示資料排序
router.post('/', homeController.postHome)


module.exports = router
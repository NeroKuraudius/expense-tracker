const express = require('express')
const router = express.Router()


// 首頁
router.get('/', (req, res) => {
  res.render('index', { CATEGORY })
})




module.exports = router
const express = require('express')
const router = express.Router()
const CATEGORY = {
  家居物業: 'fa-solid fa-house',
  交通出行: 'fa-solid fa-van-shuttle',
  休閒娛樂: 'fa-solid fa-face-grin-beam',
  餐飲食品: 'fa-solid fa-face-grin-beam',
  其他: 'fa-solid fa-pen'
}

router.get('/', (req, res) => {
  res.render('index', { CATEGORY })
})

module.exports = router
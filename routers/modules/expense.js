const express = require('express')
const router = express.Router()
const Expense = require('../../models/Expense')

const CATEGORY = {
  家居物業: 'fa-solid fa-house',
  交通出行: 'fa-solid fa-van-shuttle',
  休閒娛樂: 'fa-solid fa-face-grin-beam',
  餐飲食品: 'fa-solid fa-face-grin-beam',
  其他: 'fa-solid fa-pen'
}

// 新增頁面
router.get('/new', (req, res) => {
  res.render('new')
})

// 新增支出
router.post('/', (req, res) => {
  const { name, date, category, cost } = req.body

  Expense.create({ name, date, category, cost })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})


// 刪除支出
router.delete('/')

module.exports = router
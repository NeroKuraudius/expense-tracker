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

  if (!name || !date || !category || !cost) {
    res.render('new', { name, date, category, cost })
  }

  Expense.create({ name, date, category, cost })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})


// 修改支出頁面
router.get('/:id/edit', (req, res) => {
  const id = req.params.id

  Expense.findById(id)
    .lean()
    .then(item => res.render('edit', { item }))
    .catch(err => console.log(err))
})


// 修改支出
router.put(':id/edit', (req, res) => {
  const id = req.params.id
})


// 刪除支出
router.delete('/:id', (req, res) => {
  const id = req.params.id

  return Expense.findById(id)
    .then(item => item.deleteOne({ id })) // 舊版是 collection.remove()
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
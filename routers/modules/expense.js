const express = require('express')
const router = express.Router()
const Expense = require('../../models/Expense')
const Category = require('../../models/Category')

// 新增頁面
router.get('/new', (req, res) => {
  Category.find()
    .lean()
    .then(categories => res.render('new', { categories }))
    .catch(err => console.log(err))
})


// 新增支出
router.post('/', (req, res) => {
  const { name, date, categoryId, cost } = req.body

  Expense.create({ name, date, categoryId, cost })
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
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, date, category, cost } = req.body

  return Expense.findOneAndUpdate({ _id: id }, { name, date, category, cost })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})


// 刪除支出
router.delete('/:id', (req, res) => {
  const id = req.params.id

  return Expense.findById(id)
    .then(item => item.deleteOne({ id })) // 舊版是 item.remove()
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
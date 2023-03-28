const express = require('express')
const router = express.Router()
const Expense = require('../../models/Expense')
const Category = require('../../models/Category')

// 新增頁面
router.get('/new', (req, res) => {
  return Category.find()
    .lean()
    .then(categories => res.render('new', { categories }))
    .catch(err => console.log(err))
})


// 新增支出
router.post('/', (req, res) => {
  const userId = req.user._id
  const { name, date, categoryId, cost } = req.body

  if (!name || !date || !categoryId || !cost) {
    return Category.findById(categoryId)
      .lean()
      .then(category => res.render('new', { name, date, cost }))
  }

  return Expense.create({ name, date, cost, categoryId, userId })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})


// 修改支出頁面
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  return Category.find()
    .lean()
    .then(categories => {
      return Expense.findOne({ _id, userId })
        .populate('categoryId')
        .lean()
        .then(item => res.render('edit', { item, categories }))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})


// 修改支出
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, date, categoryId, cost } = req.body

  return Expense.findOneAndUpdate({ _id, userId }, { name, date, categoryId, cost })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})


// 刪除支出
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  return Expense.findOne({ userId, _id })
    .then(item => item.deleteOne({ _id })) // 舊版是 item.remove()
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
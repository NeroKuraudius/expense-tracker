const express = require('express')
const router = express.Router()
const Expense = require('../../models/Expense')
const Category = require('../../models/Category')

// 首頁
router.get('/', (req, res) => {

  return Category.find()
    .lean()
    .then((categories) => {
      return Expense.find()
        .populate('categoryId') // 以'categoryId'欄位把Expense跟Category資料庫關聯
        .lean()
        .sort({ date: 'desc' })
        .then(items => res.render('index', { items, categories }))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

// 顯示資料排序
router.post('/', (req, res) => {
  const sorter = req.body
  console.log(req.body)
  res.redirect('/')
})


module.exports = router
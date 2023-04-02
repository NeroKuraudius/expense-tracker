const express = require('express')
const router = express.Router()
const Expense = require('../../models/Expense')
const Category = require('../../models/Category')

// 首頁
router.get('/', (req, res) => {
  const userId = req.user._id

  return Category.find()
    .lean()
    .then((categories) => {
      return Expense.find({ userId })
        .populate('categoryId') // 以'categoryId'欄位把Expense跟Category資料庫關聯
        .lean()
        .sort({ date: 'desc' })
        .then((items) => {
          let totalAmount = 0
          items.forEach(item => {
            totalAmount += item.cost
          })
          return res.render('index', { items, categories, totalAmount })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

// 顯示資料排序
router.post('/', (req, res) => {
  const userId = req.user._id
  const { categoryId } = req.body

  if (categoryId === 'all') {
    return res.redirect('/')
  }

  return Category.find()
    .lean()
    .then(categories => {
      return Expense.find({ userId, categoryId })
        .populate('categoryId') // 以'categoryId'欄位把Expense跟Category資料庫關聯
        .lean()
        .sort({ date: 'desc' })
        .then(items => {
          let totalAmount = 0
          items.forEach(item => {
            totalAmount += item.cost
          })
          return res.render('index', { items, categories, totalAmount })
        })
        .catch(err => console.log(err))
    }
    )
    .catch(err => console.log(err))
})


module.exports = router
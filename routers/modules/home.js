const express = require('express')
const router = express.Router()
const Expense = require('../../models/Expense')
const Category = require('../../models/Category')

// 首頁
router.get('/', (req, res) => {
  // 首頁登入後初始化:
  const budget = req.user.budget
  const userId = req.user._id
  const theDay = new Date()
  const thisYear = theDay.getFullYear()
  const thisMonth = theDay.getMonth() + 1  // 月份為0~11
  const selectTime = `${thisYear}-${thisMonth}`

  return Category.find()
    .lean()
    .then((categories) => {
      return Expense.find({ userId, date: { $regex: `^${selectTime}` } })
        .populate('categoryId')
        .lean()
        .sort({ date: 'desc' })
        .then((items) => {
          let totalAmount = 0
          items.forEach(item => {
            totalAmount += item.cost
          })

          if (budget) {
            const leftDays = getDaysInCurrentMonth()
            const dayCost = Math.round((budget-totalAmount) / leftDays)
            return res.render('index', { items, categories, totalAmount, thisYear, thisMonth, selectTime, dayCost })
          }
          return res.render('index', { items, categories, totalAmount, thisYear, thisMonth, selectTime })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

// 顯示資料排序
router.post('/', (req, res) => {
  const budget = req.user.budget
  const userId = req.user._id
  const { categoryId, selectTime } = req.body

  const theDay = new Date(selectTime)
  const thisYear = theDay.getFullYear()
  const thisMonth = theDay.getMonth() + 1  // 月份為0~11

  const condition = { userId, categoryId , date: { $regex: `^${selectTime}` } }

  if (categoryId === "ALL" || categoryId === "DEFAULT"){
    delete condition.categoryId
  }

  return Category.find()
    .lean()
    .then(categories => {
      return Expense.find(condition)
        .populate('categoryId')
        .lean()
        .sort({ date: 'desc' })
        .then(items => {
          let totalAmount = 0
          items.forEach(item => {
            totalAmount += item.cost
          })

          if (budget) {
            const leftDays = getDaysInCurrentMonth()
            const dayCost = Math.round((budget-totalAmount) / leftDays)
            return res.render('index', { items, categories, categoryId, totalAmount, thisYear, thisMonth, selectTime, dayCost })
          }
          
          return res.render('index', { items, categories, categoryId, totalAmount, thisYear, thisMonth, selectTime })
        })
        .catch(err => console.log(err))
    }
    )
    .catch(err => console.log(err))
})

// ====================================================================

function getDaysInCurrentMonth() {
    const now = new Date()
    const today = now.getDate()
    const year = now.getFullYear()
    const month = now.getMonth()

    const firstDayNextMonth = new Date(year, month + 1, 1)
    const lastDayThisMonth = new Date(firstDayNextMonth - 1)
    
    return lastDayThisMonth.getDate() - today
}

module.exports = router
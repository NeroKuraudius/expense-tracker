const express = require('express')
const router = express.Router()


const homeController = require('../../controllers/homeController')

// 首頁
router.get('/', homeController.getHome)


const Expense = require('../../models/Expense')
const Category = require('../../models/Category')
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
    })
    .catch(err => console.log(err))
})


function getDaysInCurrentMonth() {
  const now = new Date()
  const today = now.getDate()
  const month = now.getMonth()
  const year = now.getFullYear()

  const firstDayNextMonth = new Date(year, month + 1, 1)
  const lastDayThisMonth = new Date(firstDayNextMonth - 1)

  // 回傳值: 本月總天數 - 當下日期 + 1 (含當天)
  return lastDayThisMonth.getDate() - today + 1
}

module.exports = router
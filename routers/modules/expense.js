const express = require('express')
const router = express.Router()
const Expense = require('../../models/Expense')
const Category = require('../../models/Category')
const expenseController = require('../../controllers/expenseController')

// 新增頁面
router.get('/new', expenseController.getExpense)

// 修改支出頁面
router.get('/edit/:id', expenseController.editExpense)

// 修改支出
router.put('/:id', expenseController.putExpense)

// 刪除支出
router.delete('/:id', expenseController.deleteExpense)

// 新增支出
router.post('/', (req, res) => {
  const userId = req.user._id
  const { name, date, categoryId, cost } = req.body

  if (!name || !date || !categoryId || !cost) {
    return Category.findById(categoryId)
      .lean()
      .then(category => { return res.render('new', { name, date, cost }) })
      .catch(err => console.log(err))
  }

  return Expense.create({ name, date, cost, categoryId, userId })
    .then(() => { return  res.redirect('/') })
    .catch(err => console.log(err))
})






module.exports = router
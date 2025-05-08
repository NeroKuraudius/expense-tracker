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
router.post('/', expenseController.postExpense)




module.exports = router
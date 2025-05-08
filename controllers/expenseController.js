const expenseService = require('../services/expense-service')

const expenseController = {
    // 新增頁面
    getExpense: (req,res,next)=>{
        expenseService.getExpense(req, (err,data) => err ? next(err): res.render('new', data))
    },
    // 修改頁面
    editExpense: (req,res,next)=>{
        expenseService.editExpense(req, (err,data) => err ? next(err): res.render('edit', data))
    }
}


module.exports = expenseController
const expenseService = require('../services/expense-service')

const expenseController = {
    // 新增頁面
    getExpense: (req,res,next)=>{
        expenseService.getExpense(req, (err,data) => err ? next(err): res.render('new', data))
    }
}


module.exports = expenseController
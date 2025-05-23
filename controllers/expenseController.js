const expenseService = require('../services/expense-service')

const expenseController = {
    // 新增頁面
    getExpense: (req,res,next)=>{
        expenseService.getExpense(req, (err,data) => err ? next(err) : res.render('new', data))
    },
    // 修改頁面
    editExpense: (req,res,next)=>{
        expenseService.editExpense(req, (err,data) => err ? next(err) : res.render('edit', data))
    },
    // 修改支出
    putExpense: (req,res,next)=>{
        expenseService.putExpense(req, (err,data) => err ? next(err) : res.redirect('/'))
    },
    // 刪除支出
    deleteExpense: (req,res,next)=>{
        expenseService.deleteExpense(req, (err,data) => err ? next(err) : res.redirect('/'))
    },
    // 新增支出
    postExpense: (req,res,next)=>{
        expenseService.postExpense(req, (err, data) => {
            if (err) next(err)
            Object.keys(data).length === 0 ? res.redirect('/') : res.render('new', data) 
        })
    }
}


module.exports = expenseController
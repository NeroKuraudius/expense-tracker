const Expense = require('../models/Expense')
const Category = require('..//models/Category')

const expenseService = {
    // 新增頁面
    getExpense: (req,cb)=>{
        return Category.find()
            .lean()
            .then(categories => { return cb(null, { categories }) })
            .catch(err => cb(err.message))
    },

    // 修改頁面
    editExpense: (req,cb)=>{
        const userId = req.user._id
        const _id = req.params.id
    
        return Category.find()
        .lean()
        .then(categories => {
            return Expense.findOne({ _id, userId })
                .populate('categoryId')
                .lean()
                .then(item => { return cb(null, { item, categories }) })
                .catch(err => cb(err.message))
        })
        .catch(err => console.log(err))
    },

    // 修改支出
    putExpense: (req,cb)=>{
        const userId = req.user._id
        const _id = req.params.id
        const { name, date, categoryId, cost } = req.body

        return Expense.findOneAndUpdate({ _id, userId }, { name, date, categoryId, cost })
            .then(() => { return cb(null, {}) })
            .catch(err => cb(err.message))
    },

    // 刪除支出
    deleteExpense: (req,cb)=>{
        const userId = req.user._id
        const _id = req.params.id

        return Expense.findOne({ userId, _id })
            .then(item => item.deleteOne({ _id })) // 舊版是 item.remove()
            .then(() => { return cb(null, {}) })
            .catch(error => cb(err.message))
    },
}


module.exports = expenseService
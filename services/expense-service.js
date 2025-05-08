const Expense = require('../models/Expense')
const Category = require('..//models/Category')

const expenseService = {
    getExpense: (req,cb)=>{
        return Category.find()
        .lean()
        .then(categories => { return cb(null, { categories }) })
        .catch(err => cb(err.message))
    },
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
    putExpense: (req,cb)=>{
        const userId = req.user._id
        const _id = req.params.id
        const { name, date, categoryId, cost } = req.body

        return Expense.findOneAndUpdate({ _id, userId }, { name, date, categoryId, cost })
        .then(() => {return cb(null, {}) })
        .catch(err => cb(err.message))
    }
}


module.exports = expenseService
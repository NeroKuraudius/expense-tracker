const Expense = require('../models/Expense')
const Category = require('..//models/Category')

const expenseService = {
    getExpense: (req,cb)=>{
        return Category.find()
        .lean()
        .then(categories => { return cb(null, { categories }) })
        .catch(err => cb(err.message))
    }
}


module.exports = expenseService
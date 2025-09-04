const Expense = require('../models/Expense')
const Category = require('..//models/Category')

const expenseService = {
    // 新增頁面
    getExpense: async(req,cb)=>{
        try{
            const categories = await Category.find().lean()
            return cb(null, { categories })
        }catch(err){
            console.error('[Service] 新增支出頁面渲染失敗', err)
            return cb(err.message)
        }
    },

    // 修改頁面
    editExpense: async(req,cb)=>{
        const userId = req.user._id
        const _id = req.params.id
    
        try{
            const categories = await Category.find().lean()
            const expense = await Expense.findOne({ _id, userId })
                .populate('categoryId')
                .lean()

            if (expense){
                return cb(null,{ expense, categories })
            }
        }catch(err){
            console.error('[Service] 支出修改頁面渲染失敗', err)
            return cb(err.message)
        }
    },

    // 修改支出
    putExpense: async(req,cb)=>{
        const userId = req.user._id
        const _id = req.params.id
        const { name, date, categoryId, cost } = req.body

        try{
            const updatedExpense = await Expense.findOneAndUpdate({ _id, userId }, { name, date, categoryId, cost })
            if (updatedExpense){
                return cb(null, {})
            }else{
                return cb(null, { errs: [{ errMsg: '支出修改失敗' }] })
            }
        }catch(err){
            console.error('[Service] 支出修改失敗', err)
            return cb(err.message)
        }
    },

    // 刪除支出
    deleteExpense: async(req,cb)=>{
        const userId = req.user._id
        const _id = req.params.id

        try{
            const deletedExpense = await Expense.findOneAndDelete({ userId, _id })
        
            if (deletedExpense) {
                return cb(null, {})
            } else {
                return cb(null, { errs: [{ errMsg: '支出刪除失敗' }] })
            }
        }catch(err){
            console.error('[Service] 支出刪除失敗', err)
            return cb(err.message)
        }
    },

    // 新增支出
    postExpense: async(req,cb)=>{
        const userId = req.user._id
        const { name, date, categoryId, cost } = req.body

        try{
            if (!name.trim() || !date || !categoryId || !cost){
                const categories = await Category.find().lean()
                return cb(null, { name, date, cost, categoryId, categories })
            }

            const newExpense = await Expense.create({ name, date, cost, categoryId, userId })
            if (newExpense){
                return cb(null, {})
            }else{
                return cb(null, { errs: [{ errMsg: '支出新增失敗' }]})
            }
        }catch(err){
            console.error('[Service] 支出新增失敗', err)
            return cb(err.message)
        }
    }
}


module.exports = expenseService
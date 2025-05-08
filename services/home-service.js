const Expense = require('../models/Expense')
const Category = require('../models/Category')

const getDaysInCurrentMonth = require('./utils/daysHandler')

const homeService = {
    // 進入首頁
    getHome: (req,cb)=>{
        // 取得使用者相關資訊
        const budget = req.user.budget
        const userId = req.user._id
        
        // 取得當天的年/月/日
        const theDay = new Date()
        const thisYear = theDay.getFullYear()
        const thisMonth = theDay.getMonth() + 1  // 月份為0~11
    
        let selectTime = `${thisYear}-${thisMonth}`
        if (selectTime.length < 7) selectTime = selectTime.replace('-', '-0')  // 把月份變成雙位數: 3 → 03 / 9 → 09
    
        return Category.find()
        .lean()
        .then((categories) => {
            return Expense.find({ userId, date: { $regex: `^${selectTime}` } })
                .populate('categoryId')
                .lean()
                .sort({ date: 'desc' })
                .then((items) => {
                    let totalAmount = 0
                    items.forEach(item => {
                    totalAmount += item.cost
                    })
        
                    if (budget) {
                    const leftDays = getDaysInCurrentMonth()
                    const dayCost = Math.round((budget-totalAmount) / leftDays)
                    return cb(null, { items, categories, totalAmount, thisYear, thisMonth, selectTime, dayCost })
                    }
                    return cb(null, { items, categories, totalAmount, thisYear, thisMonth, selectTime })
                })
            .catch(err => cb(err.message))
        })
        .catch(err => cb(err.message))
    },

    // 首頁排序
    postHome: (req,cb)=>{
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
                    return cb(null, { items, categories, categoryId, totalAmount, thisYear, thisMonth, selectTime, dayCost })
                }

                return cb(null, { items, categories, categoryId, totalAmount, thisYear, thisMonth, selectTime })
                })
                .catch(err => cb(err.message))
            })
            .catch(err => cb(err.message))
    }
}

module.exports = homeService
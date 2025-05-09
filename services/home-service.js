const Expense = require('../models/Expense')
const Category = require('../models/Category')

const { getYearAndMonthOfToday, getDaysInCurrentMonth } = require('../helpers/days-helpers')
const costCalculator = require('../helpers/calculation-helpers')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')

const homeService = {
    // 進入首頁
    getHome: (req,cb)=>{
        // 取得使用者相關資訊
        const budget = req.user.budget
        const userId = req.user._id
        
        // 取得分頁列參數
        const page = Number(req.query.page) || 1
        const limit = 10
        const offset = getOffset(limit, page)

        // 取得當天的年/月/日
        const selectTime = Number(req.query.selectTime) || getYearAndMonthOfToday()
    
        return Category.find()
        .lean()
        .then((categories) => {
            return Expense.find({ userId, date: { $regex: `^${selectTime}` } })
                .populate('categoryId')
                .lean()
                .sort({ date: 'desc' })
                .skip(offset)
                .limit(limit)
                .then(async(items) => {
                    const { totalAmount, totalCost } = await costCalculator(userId, selectTime)
                    const pagination = getPagination(limit, page, totalAmount)

                    if (budget) {
                        const leftDays = getDaysInCurrentMonth()
                        const dayCost = Math.round((budget-totalCost) / leftDays)
                        return cb(null, { items, categories, totalCost, thisYear, thisMonth, selectTime, dayCost, pagination })
                    }
                    return cb(null, { items, categories, totalCost, thisYear, thisMonth, selectTime, pagination })
                })
            .catch(err => cb(err.message))
        })
        .catch(err => cb(err.message))
    },

    // 首頁排序
    postHome: (req,cb)=>{
        // 取得使用者相關資訊 & body參數
        const budget = req.user.budget
        const userId = req.user._id
        const { categoryId, selectTime } = req.body

        // 取得分頁列參數
        const page = Number(req.query.page) || 1
        const limit = 10
        const offset = getOffset(limit, page)

        // 取得當天的年/月/日
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
                .skip(offset)
                .limit(limit)
                .then(async(items) => {
                    const { totalAmount, totalCost } = await costCalculator(userId, selectTime)
                    const pagination = getPagination(limit, page, totalAmount)

                if (budget) {
                    const leftDays = getDaysInCurrentMonth()
                    const dayCost = Math.round((budget-totalCost) / leftDays)
                    return cb(null, { items, categories, categoryId, totalCost, thisYear, thisMonth, selectTime, dayCost, pagination })
                }

                return cb(null, { items, categories, categoryId, totalCost, thisYear, thisMonth, selectTime, pagination })
                })
                .catch(err => cb(err.message))
            })
            .catch(err => cb(err.message))
    }
}

module.exports = homeService
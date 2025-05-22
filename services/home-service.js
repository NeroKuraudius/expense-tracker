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
        const selectTime = req.query.selectTime || getYearAndMonthOfToday()

        // 取得支出類別
        const categoryId = req.query.categoryId || 'DEFAULT'

        // Expense的搜尋條件
        const condition = { userId, date: { $regex: `^${selectTime}` }}
        if (categoryId !== 'DEFAULT' && categoryId !== 'ALL') condition.categoryId = categoryId
    
        return Category.find()
        .lean()
        .then((categories) => {
            return Expense.find(condition)
                .populate('categoryId')
                .lean()
                .sort({ date: 'desc', _id: 'desc' })
                .skip(offset)
                .limit(limit)
                .then(async(items) => {
                    const { totalAmount, totalCost } = await costCalculator(userId, selectTime, categoryId)
                    const pagination = getPagination(limit, page, totalAmount)

                    if (budget) {
                        const surplus = budget - totalCost

                        if (surplus > 0){
                            const leftDays = getDaysInCurrentMonth()
                            const dayCost = Math.round(surplus / leftDays)
                            return cb(null, { items, categories, categoryId, totalCost, selectTime, pagination, page, dayCost })
                        }else{
                            const dayCost = surplus
                            return cb(null, { items, categories, categoryId, totalCost, selectTime, pagination, page, dayCost })
                        }
                    }
                    return cb(null, { items, categories, categoryId, totalCost, selectTime, pagination, page })
                })
            .catch(err => cb(err.message))
        })
        .catch(err => cb(err.message))
    }
}

module.exports = homeService
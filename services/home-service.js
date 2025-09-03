const Expense = require('../models/Expense')
const Category = require('../models/Category')
const Budget = require('../models/Budget')

const { getYearAndMonthOfToday, getDaysInCurrentMonth } = require('../helpers/days-helpers')
const costCalculator = require('../helpers/calculation-helpers')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')

const homeService = {
    // 進入首頁
    getHome: async(req,cb)=>{
        // 取得使用者相關資訊
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
    
        try{
            const budget = await Budget.findOne({ userId, month: selectTime})
            const categories = await Category.find().lean()
            const expenses = await Expense.find(condition)
            .populate('categoryId')
            .lean()
            .sort({ date: 'desc', _id: 'desc' })
            .skip(offset)
            .limit(limit)

            const { totalAmount, totalCost } = await costCalculator(userId, selectTime, categoryId)
            const pagination = getPagination(limit, page, totalAmount)

            if (budget && categoryId.length < 10) {
                const surplus = budget.amount - totalCost

                if (surplus > 0){
                    const leftDays = getDaysInCurrentMonth()
                    const dayCost = Math.round(surplus / leftDays)
                    return cb(null, { expenses, categories, categoryId, totalCost, selectTime, pagination, page, dayCost })
                }else{
                    const dayCost = surplus
                    return cb(null, { expenses, categories, categoryId, totalCost, selectTime, pagination, page, dayCost })
                }
            }
            return cb(null, { expenses, categories, categoryId, totalCost, selectTime, pagination, page })

        }catch(err){
            console.log('[Service] 首頁渲染失敗:', err)
            return cb(err.message, {})
        }
    }
}

module.exports = homeService
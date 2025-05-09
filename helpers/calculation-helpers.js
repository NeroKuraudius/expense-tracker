const Expense = require('../models/Expense')

const costCalculator = async(userId, selectTime, categoryId) => {
    const condition = { userId, date: { $regex: `^${selectTime}` } }
    if (categoryId !== 'DEFAULT' && categoryId !== 'ALL') condition.categoryId = categoryId

    const expenses = await Expense.find(condition).lean()

    const totalAmount = expenses.length
    const totalCost = expenses.reduce((sum, expense) => sum + expense.cost, 0)

    return { totalAmount, totalCost}
}

module.exports = costCalculator
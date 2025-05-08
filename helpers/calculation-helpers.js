const Expense = require('../models/Expense')

const costCalculator = async(userId, selectTime) => {
    const expenses = await Expense.find({ userId, date: { $regex: `^${selectTime}` } }).lean()

    const totalAmount = expenses.length
    const totalCost = expenses.reduce((sum, expense) => sum + expense.cost, 0)

    return { totalAmount, totalCost}
}

module.exports = costCalculator
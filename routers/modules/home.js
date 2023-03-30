const express = require('express')
const router = express.Router()
const Expense = require('../../models/Expense')

// 首頁
router.get('/', (req, res) => {
  Expense.find()
    .lean()
    .sort({ _id: 'asc' })  
    .then(items => res.render('index', { items }))
    .catch(err => console.log(err))
})




module.exports = router
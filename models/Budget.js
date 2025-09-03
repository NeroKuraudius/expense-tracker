const mongoose = require('mongoose')
const Schema = mongoose.Schema
const budgetSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  month: { 
    type: String, // ex: 2025-09
    required: true
  },
  amount: { 
    type: Number, 
    required: true 
  }
}, { 
  timestamps: true 
})

module.exports = mongoose.model('Budget', budgetSchema)
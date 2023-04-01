const mongoose = require('mongoose')
const Category = require('../Category')
const categoryList = [
  { name: '休閒娛樂', icon: 'fa-solid fa-face-grin-beam' },
  { name: '其他', icon: 'fa-solid fa-pen' },
  { name: '家居物業', icon: 'fa-solid fa-house' },
  { name: '餐飲食品', icon: 'fa-solid fa-face-grin-beam' },
  { name: '交通出行', icon: 'fa-solid fa-van-shuttle' }
]

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('MongoDB error!')
})
db.once('open', () => {
  Category.create(categoryList)
    .then(() => {
      console.log('categorySeeder running finished!')
      db.close()
      process.exit()
    }
    )
    .catch(err => console.log('category run failed.'))

})
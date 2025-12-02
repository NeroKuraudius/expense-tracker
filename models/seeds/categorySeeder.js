const Category = require('../Category')
const categoryList = [
  { id: 1 ,name: '餐飲食品', icon: 'fa-solid fa-utensils' },
  { id: 2 ,name: '休閒娛樂', icon: 'fa-solid fa-face-grin-beam' },
  { id: 3 ,name: '家居物業', icon: 'fa-solid fa-house' },
  { id: 4 ,name: '交通出行', icon: 'fa-solid fa-van-shuttle' },
  { id: 5 ,name: '其他', icon: 'fa-solid fa-pen' }
]

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('MongoDB error!')
})
db.once('open', async() => {
  try{
    const dataCheck1 = await Category.exists({ name:'其他' })
    const dataCheck2 = await Category.exists({ name:'交通出行' })
    if (dataCheck1 && dataCheck2) {
      console.log('No running categorySeeder')
    }else{
      const newData = await Category.create(categoryList)
      console.log('categorySeeder running finished!')
    }
  }catch(err){
    console.log(`categorySeeder run failed: ${err.message}`)
  }finally{
    db.close()
    process.exit()
  }
})
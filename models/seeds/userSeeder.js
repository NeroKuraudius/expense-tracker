const bcrypt = require('bcryptjs')
const User = require('../User')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const SEED_USER = {
  name: 'TEST',
  email: 'test@example.com',
  password: 'zzz123',
}

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('MongoDB error!')
})
db.once('open', async () => {
  try{
    const testUserCheck = await User.findOne({name:'TEST'})
    if (testUserCheck) {
      console.log('No running userSeeder')
    }else{
      const salt = await bcrypt.genSalt(12)
      const hash = await bcrypt.hash(SEED_USER.password, salt)
      const testUser = await User.create({
        name: SEED_USER.name,
        email: SEED_USER.email,
        password: hash
      })
      console.log('userSeeder running finished!')
    }
  }catch(err){
    console.log(`userSeeder run failed: ${err.message}`)
  }finally{
    db.close()
    process.exit()
  }
})

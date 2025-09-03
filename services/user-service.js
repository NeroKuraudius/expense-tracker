const User = require('../models/User')
const Budget = require('../models/Budget')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const { getYearAndMonthOfToday } = require('../helpers/days-helpers')

const userService = {
    // 登出
    getLogout: (req,cb)=>{
        req.logout((err) => {
        if (err) return cb(err.message)

        req.flash('successMsg', '您已成功登出')
        return cb(null, { })
        })
    },

    // 註冊
    postRegister: (req,cb)=>{
        const { name, email, password, confirmPassword } = req.body
        const errs = []
    
        if (!name || !email || !password || !confirmPassword) {
            errs.push({ errMsg: '所有欄位皆為必填' })
        }
        if (password !== confirmPassword) {
            errs.push({ errMsg: '所輸入的密碼不一致' })
        }
        if (errs.length) {
            return cb(null, { errs, name, email, password, confirmPassword})
        }
    
        return User.findOne({ email })
            .lean()
            .then(user => {
                if (user) {
                    errs.push({ errMsg: '該帳號已註冊' })
                    return cb(null, { errs, name, email, password, confirmPassword })
                }
                return bcrypt.genSalt(12)
                .then(salt => bcrypt.hash(password, salt))
                .then(hash => User.create({ name, email, password: hash }))
                .then(() => {
                    req.flash('successMsg', '請用新帳號重新登入')
                    return cb(null, { })
                })
                .catch(err => cb(err.message))
            })
            .catch(err => cb(err.message))
    },

    // 修改使用者資料
    postSetting: async(req,cb)=>{
        let { name, budget, password } = req.body

        if (name.trim().length === 0) {
            req.flash('warningMsg', '姓名不可為空')
            return cb(null, {})
        }

        if (!budget || budget === 0){
            budget = null
        }

        const email = req.user.email
        const userId = req.user._id

        // 啟動 transaction
        const session = await mongoose.startSession()

        try{
            const user = await User.findOne({ email }).lean()
            if (!user){
                req.flash('warningMsg', '使用者不存在')
                return cb(null, {})
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                req.flash('warningMsg', '密碼輸入錯誤')
                return cb(null, {})
            }

            await User.updateOne(
                { email }, 
                { $set: { name } }, 
                { session }
            )

            if(budget){
                const month = getYearAndMonthOfToday()
                await Budget.updateOne(
                    { userId, month },
                    { $set: { amount: budget } }, 
                    { upsert: true, session }
                )
            }
            
            // transaction 提交
            await session.commitTransaction()

            req.flash('successMsg', '資料修改成功')
            return cb(null, {})
        }catch(err){
            // transaction 回滾
            await session.abortTransaction()

            console.error('[Service] 更新資料時發生錯誤:', err)
            req.flash('errorMsg', '資料修改失敗，請稍後再試。')
            return cb(err, {})
        }finally{
            // transaction 結束
            session.endSession()
        }
    }
}


module.exports = userService
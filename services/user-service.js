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
        return cb(null, {})
        })
    },

    // 註冊
    postRegister: async(req,cb)=>{
        const { name, email, password, confirmPassword } = req.body
        const errs = []
    
        if (!name || !email || !password || !confirmPassword) {
            errs.push({ errMsg: '所有欄位皆為必填' })
        }
        if (password !== confirmPassword) {
            errs.push({ errMsg: '所輸入的密碼不一致' })
        }
        if (errs.length) {
            return cb(null, { errs, name, email, password, confirmPassword })
        }
    
        try{
            const user = await User.findOne({ email }).lean()
            if (user) {
                errs.push({ errMsg: '該帳號已註冊' })
                return cb(null, { errs, name, email, password, confirmPassword })
            }

            const hash = await bcrypt.hash(password, 12)
            const newUser = await User.create({ name, email, password: hash })
            if (newUser){
                console.log(`[Service] 使用者 ${name} 註冊成功`)
                req.flash('successMsg', '請用新帳號重新登入')
                return cb(null, {})
            }

        }catch(err){
            console.error('[Service] 使用者註冊失敗', err)
            return cb(err.message, { errs:[ {errMsg: '註冊失敗，請稍後再試'} ], name, email, password, confirmPassword })
        }
    },

    // 修改頁面
    getSetting: async(req,cb)=>{
        const userId = req.user._id
        const month = getYearAndMonthOfToday()

        try{
            const budget = await Budget.findOne({ userId, month }).lean()
            if (budget && budget.amount > 0){
                return cb(null, { user: req.user, budget: budget.amount })
            }else{
                return cb(null, { user: req.user })
            }
        }catch(err){
            console.error('[Service] 使用者修改頁面渲染失敗', err)
            return cb(err.message)
        }
    },

    // 修改使用者資料
    postSetting: async(req,cb)=>{
        let { name, budget, password } = req.body

        if (name.trim().length === 0) {
            req.flash('warningMsg', '姓名不可為空')
            return cb(null, {})
        }

        if (!budget || budget === 0){
            budget = 0
        }

        const email = req.user.email
        const userId = req.user._id

        // 建立 session
        const session = await mongoose.startSession()

        try{
            // 啟動 transaction
            session.startTransaction()

            const user = await User.findOne({ email }).lean().session(session)
            if (!user){
                // // transaction 回滾
                await session.abortTransaction()

                req.flash('warningMsg', '使用者不存在')
                return cb(null, {})
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                // // transaction 回滾
                await session.abortTransaction()

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

            console.log(`[Service] 使用者 ${userId} 個人資料修改成功`)
            req.flash('successMsg', '資料修改成功')
            return cb(null, {})
        }catch(err){
            if (session.inTransaction()) {
                // transaction 回滾
                await session.abortTransaction()
            }
            console.error('[Service] 更新個人資料時發生錯誤:', err)
            req.flash('errorMsg', '資料修改失敗，請稍後再試。')
            return cb(err.message)
        }finally{
            // transaction 結束
            session.endSession()
        }
    }
}


module.exports = userService
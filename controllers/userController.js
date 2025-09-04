const userService = require('../services/user-service')

const userController = {
    // 登出
    getLogout : (req,res,next)=>{
        userService.getLogout(req, (err,data)=> err ? next(err) : res.redirect('/users/login'))
    },
    // 註冊
    postRegister: (req,res,next)=>{
        userService.postRegister(req, (err,data)=> {
            if(err) next(err) 
            Object.keys(data).length === 0 ? res.redirect('/users/login') : res.render('register', data)
        })
    },
    // 修改頁面
    getSetting: (req,res,next)=>{
        userService.getSetting(req, (err,data)=> err ? next(err) : res.render('setting', data))
    },
    // 修改使用者資料
    postSetting: (req,res,next)=>{
        userService.postSetting(req, (err,data)=> err ? next(err) : res.redirect('/users/setting'))
    }
}

module.exports = userController
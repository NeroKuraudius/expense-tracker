const homeService = require('../services/home-service')

const homeController = {
    // 進入首頁
    getHome: (req,res,next)=>{
        homeService.getHome(req, (err,data) => err ? next(err) : res.render('index', data))
    },
    // 首頁排序
    postHome: (req,res,next)=>{

    }
}

module.exports = homeController
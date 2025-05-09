const homeService = require('../services/home-service')

const homeController = {
    // 進入首頁
    getHome: (req,res,next)=>{
        homeService.getHome(req, (err,data) => err ? next(err) : res.render('index', data))
    }
}

module.exports = homeController
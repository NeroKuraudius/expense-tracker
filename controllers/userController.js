const userService = require('../services/user-service')

const userController = {
    getLogout : (req,res,next)=>{
        userService.getLogout(req, (err,next)=> err ? next(err) : res.redirect('/users/login'))
    }
}

module.exports = userController
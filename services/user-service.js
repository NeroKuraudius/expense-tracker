const User = require('../models/User')
const bcrypt = require('bcryptjs')

const userService = {
    getLogout: (req,cb)=>{
        req.logout((err) => {
        if (err) return cb(err.message)

        req.flash('successMsg', '您已成功登出')
        return cb(null, { })
        })
}
}

module.exports = userService
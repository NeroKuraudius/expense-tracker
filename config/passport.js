const User = require('../models/User')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

module.exports = app => {
  // passport初始化
  app.use(passport.initialize())
  app.use(passport.sessiong())

  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email' },
    (email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user) { return done(null, false, flash({ 'warningMsg': 'The email has not registered yet.' })) }
          if (user.password !== password) {
            return done(null, false, flash({ 'warningMsg': 'Email or password incorrect.' }))
          }
          return done(null, user)
        })
        .catch(err => done(err, null))
    }))

  //序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}
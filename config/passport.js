const User = require('../models/User')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const FBStrategy = require('passport-facebook').Strategy

module.exports = app => {
  // passport初始化
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true },
    (req, email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user) { return done(null, false, req.flash('warningMsg', '該帳號尚未註冊')) }
          return bcrypt.compare(password, user.password)
            .then(isMatch => {
              if (!isMatch) {
                return done(null, false, req.flash('warningMsg', '帳號或密碼錯誤'))
              }
              return done(null, user)
            })
        })
        .catch(err => done(err, null))
    })
  )

  // 設定FB登入策略
  passport.use(new FBStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json //發回的資料會在profile_json內

    User.findOne({ email })
      .then(user => {
        if (user) { return done(null, user) }
        const randomPassword = Math.random().toString(36).slice(-10)
        bcrypt.genSalt(12)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name, email, password: hash
          }))
          .then(user => {
            return done(null, user)
          })
          .catch(err => done(err, false))
      })
  }
  ))

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

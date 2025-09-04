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
    async(req, email, password, done) => {
      try{
        const user = await User.findOne({ email })
        if (!user) return done(null, false, req.flash('warningMsg', '該帳號尚未註冊'))

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return done(null, false, req.flash('warningMsg', '帳號或密碼錯誤'))

        console.log('[Passport] 本地登入策略設定成功')
        return done(null, user)
      }catch(err){
        console.error('[Passport] 本地登入策略設定失敗', err)
        return done(err.message, false)
      }
    })
  )

  // 設定FB登入策略
  passport.use(new FBStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    profileFields: ['email', 'displayName']
  }, async(accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json //發回的資料會在profile_json內

    try{
      const user = await User.findOne({ email })
      if (user) { return done(null, user) }

      const randomPassword = Math.random().toString(36).slice(-10)
      const hash = await bcrypt.hash(randomPassword, 12)

      const newUser = await User.create({ name, email, password: hash })

      if (newUser){
        console.log('[Passport] facebook登入策略設定成功')
        return done(null, user)
      }else{
        console.error('[Passport] facebook使用者新增失敗')
        return done('facebook使用者新增失敗', false)
      }
    }catch(err){
      console.error('[Passport] facebook登入策略設定失敗', err)
      return done(err.message, false)
    }
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

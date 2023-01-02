const passportLocalStrategy = require("passport-local").Strategy
const User = require("../model/user")
const bcrypt = require("bcrypt")

module.exports = (passport) => {
  try {

    passport.use(
      new passportLocalStrategy(
        {
          usernameField: "mobile"
        },
        async (mobile, password, done) => {
          const user = await User.findOne({ mobile })
          if (!user) {
            // there is no user 
            done(null, false, { message: "This mobile is not registered." })
          } else {
            // mobile number is registered
            bcrypt.compare(password, user.hash, (err, isMatch) => {
              if (isMatch == true) {
                done(null, user)
              } else {
                done(null, false, { message: "Credientials is not match." })
              }
            })
          }
        })
    )

    // serialize or deserialize the passport
    passport.serializeUser((user, done) => {
      done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => {
        done(err, user)
      })
    })

  } catch (error) {
    console.log(error)
  }
}
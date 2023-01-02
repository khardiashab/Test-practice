const passport = require("passport")


function user__login__middleware(req, res, next){
  try {
    passport.authenticate("local", {
      successRedirect : "/user/",
      failureRedirect : "/login",
      // failureFlash : true,
    })(req, res, next)
    
  } catch (error) {
    next(error)
  }
}

module.exports = user__login__middleware
module.exports = function authenticate__user__redirect__to__home (req,res,next){
  if(req.user){
    res.redirect("/user")
  } else {
    next()
  }
}
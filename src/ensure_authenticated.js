module.exports = ensure__Authenticated__middleware = (req, res, next)=>{
  if(req.user){
    next()
  } else {
    req.flash("error_msg", "First login here.")
    res.redirect("/login")
  }
}
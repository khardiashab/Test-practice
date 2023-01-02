const Test  = require("../model/test_schema")

async function user__home(req, res, next){
  try {
    const tests = await Test.find({}).sort({_id : -1})
    let name = req.user.name
  
    res.render("pages/home", {
      name , 
      tests,
      pageTitle : "Home"
    })
  } catch (error) {
    next(error)
  }

}
module.exports = user__home
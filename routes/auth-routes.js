const router = require("express").Router()
const User = require("../model/user")
const admin = require("../model/admin")
const { input__error__handler, user__sign__in__middlware } = require("../src/user_sign_in_middlware")
const user__login__middleware = require("../src/user-login-middleware")
const authenticate__user__redirect__to__home = require("../src/authenticate_user_redirect_to_home")



// user auth routes 
router.get("/", authenticate__user__redirect__to__home, async (req, res)=> {
  res.render('pages/sign-page')
})
router.get("/login", async (req, res)=> {
  res.render('pages/login-page')
})

router.post("/login", user__login__middleware )

// router post method for sign in page
router.post('/sign-in', input__error__handler, user__sign__in__middlware)


// admin authroutes   
router.get("/admin", (req, res) => {
  res.render("admin-pages/admin-login", {
    pageTitle: "Admin Login",
  })
})

router.post("/admin",  async(req,res) =>{
  let errors = []
  if(req.body.adminId === '') {errors.push("Please Enter Admin Id")}
  if(req.body.adminPassword === '') {errors.push("Please enter password")}
  
  if(errors.length > 0)
  {res.render('admin-pages/admin-login', {
    adminId : req.body.adminId,
    pageTitle: "Admin Login",
    errors
   })}
  else {
    admin.findOne({adminId : req.body.adminId}).then(admin =>{
      if(admin){
        if(admin.password == req.body.adminPassword)
          res.send("welcome admin")
        else {
          errors.push("Password was incorrect.")
          res.render('admin-pages/admin-login', {
            adminId : req.body.adminId,
            pageTitle: "Admin Login",
            errors
           })
        }
      } else {
        errors.push("Enter correct admin Id.")
        res.render('admin-pages/admin-login', {
          adminId : req.body.adminId,
          pageTitle: "Admin Login",
          errors
         })
      }
    })
  }
})
module.exports = router
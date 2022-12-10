const router = require("express").Router()

router.get("/", async (req, res)=> {
  res.send("Welocme to the list.")
})


router.get("admin/", (req, res) => {
  res.render("admin-pages/admin-login", {
    pageTitle: "Admin Login",
  })
})

router.post("admin/",  async(req,res) =>{
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
const bcrypt = require("bcrypt")
const User = require("../model/user")
const demo__user__test__creator = require("./demo_user_test_creator")

async function user__sign__in__middlware(req, res, next) {
  try {

    let mob = req.body.mobile.trim()
    let name = req.body.name.trim()
    let conPass = req.body.confrimPassword.trim()
    
    //  search if you are already a user
    let data = await User.findOne({ mobile: mob })
    if (data) {
      req.flash("error_msg", "User is already exits.")
      // res.redirect("/")
      res.render("pages/sign-page", {
        error_msg: req.flash('error_msg'),
        name,
        mobile: mob,
        pageTitle: "Register Page",
      })
    } else {
      let len = conPass.length
      let dummyPassword = conPass.charAt(0) + conPass.charAt(1) + "*".repeat(len - 4) + conPass.charAt(len - 2) + conPass.charAt(len - 1)
      
      try {
        // we create salt and password
        let new_user = new User({
          mobile: mob,
          name: name,
          hash: conPass,
          firstLastPassword: dummyPassword,
          salt: ''
        })

        // let make hash of the password and save it database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(new_user.hash, salt, (err, hash) => {
            if (!err) {
              new_user.hash = hash,
                new_user.salt = salt
              new_user.save().then(user => {
                req.flash("success_msg", "you have successfully registered.")
                res.redirect("/login")
              })
            }
          })
        })

      } catch (error) {
        // console.log(error)
        next(error)
      }
    }
  } catch (error) {

    next(error)
  }

}


function input__error__handler(req, res, next) {
  // console.log(req.body)
  let mob = req.body.mobile.trim()
  let name = req.body.name.trim()
  let pass = req.body.Password.trim()
  let conPass = req.body.confrimPassword.trim()
  // error handling
  let errors = []
  if (mob === '' || name === '' || pass === '' || conPass === '') {
    errors.push("Fill the entries.")
  }
  if (mob.length != 10) {
    errors.push("Mobile Number should 10 digit.")
  }
  if (pass.length < 6) {
    errors.push("Password is too short <6")
  }

  if (pass != conPass) {
    errors.push("Confrim Password is not match.")
  }

  if (errors.length > 0) {
    res.render('pages/sign-page', {
      mobile: mob,
      name: name,
      pageTitle: "User Sign In",
      errors
    })
  } else next()

}
module.exports = { input__error__handler, user__sign__in__middlware }
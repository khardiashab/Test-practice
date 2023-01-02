// require("dotenv").config()
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const flash = require("connect-flash")
const mongoose = require("mongoose") 
const MONGOSTORE = require("connect-mongo")

const passport = require("passport")
require("./config/passport-config")(passport)



const app = express()
// set public library
app.use(express.static("public/"))

// ejs 
app.set("view engine", "ejs")
app.use(expressLayouts)

// set body parser
app.use(express.json())
app.use(express.urlencoded({extended : false}))


// database contection
mongoose.connect(process.env.MONGODBURI, (err)=>{
  if(!err){
    console.log("DB connected...")
  }
})


// app use session 
app.use(session({
  secret : "our little secret",
  resave : false,
  saveUninitialized : true,
  store: MONGOSTORE.create({
    mongoUrl : process.env.MONGODBURI,
    ttl: 14 * 24 * 60 * 60,
    autoRemove: 'native'
  }),
  cookie : {
    maxAge : 1 * 86400000
  }
})) 

app.use(flash())
// global variable
app.use( (req, res, next ) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.error = req.flash("error")
  next()
})

app.use(passport.initialize())
app.use(passport.session())


// let ensure authenticate the user
const ensure__Athenticated = require("./src/ensure_authenticated")
// user router 
app.use("/", require("./routes/auth-routes"))
app.use("/admin", require("./routes/admin-routes"))
app.use("/user", ensure__Athenticated  , require("./routes/user-routes"))

// let handle the errors in this 
app.use(require("./src/error_handler"))

// app to listen on port 
const port = process.env.PORT || 5000

app.listen(port , console.log(`App is running on port: http://localhost:${port}`))

// require("dotenv").config()
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const flash = require("connect-flash")
const mongoose = require("mongoose")

const app = express()
// set public library
app.use(express.static("public/"))

// ejs 
app.set("view engine", "ejs")
app.use(expressLayouts)

// set body parser
app.use(express.urlencoded({extended : false}))


// database contection
mongoose.connect(process.env.MONGODBURI,  (err) => {
  if(err) console.log(err)
  else console.log("mongodb connected..")
})
// database contection
// mongoose.connect("http://localhost:27017/paper",  (err) => {
//   if(err) console.log(err)
//   else console.log("mongodb connected..")
// })

// app use session 
app.use(session({
  secret : "our little secret",
  resave : true,
  cookie: {
    maxAge : 86400000,
  },
  saveUninitialized : true
}))

app.use(flash())


// global variable
app.use( (req, res, next ) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.error = req.flash("error")
  next()
})

// user router 
app.use("/admin", require("./routes/admin-routes"))
app.use("/", require("./routes/auth-routes"))


// app to listen on port 
const port = process.env.PORT || 5000
app.listen(port , console.log(`App is running on port: http://localhost:${port}`))

const mongoose = require("mongoose")

const schema = mongoose.Schema({
  adminId : {
    type : String,
    required : [true, "You have to enter the Admin Id"]
  }, 
  password : String
})

const admin = mongoose.model("Admin", schema)
const newAdmin = new admin({
  adminId: "8003628008",
  password : "12345Singh"
})
// newAdmin.save().then(data => console.log("new admin save"));
module.exports = admin;
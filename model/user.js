const mongoose = require("mongoose")
const schema = mongoose.Schema({
  name : String,
  mobile : String,
  hash : String,
  salt : String,
  firstLastPassword : String,
})

module.exports = mongoose.model("User", schema)
const mongoose = require("mongoose")
const schema = mongoose.Schema(
  {
      subject : String,
      photoId: String,
      photoUrl : String,
      ans : {
        type : String,
        enum: {
          values: ['A', 'B', 'C', 'D', ''],
          message: '{VALUE} is not supported'
        },
        default : '',
      }, 
})

module.exports = mongoose.model("Question",  schema)
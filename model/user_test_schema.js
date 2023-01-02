const mongoose = require("mongoose")
const Schema = mongoose.Schema

const schema  = mongoose.Schema({
  attempted :{
    type : Number,
    default : 0,
  },
  user_id : {type: Schema.Types.ObjectId, ref: 'User'},
  test_id : { type: Schema.Types.ObjectId, ref: 'Test'},
  test_name : {
    type : String,
  },
  questions : [ {
    _id : { type: Schema.Types.ObjectId, ref: 'Question'},
    sorting : Number,
    user_answer : {
      type : String,
      default : "no"
    },
    question_status : {
      type : String,
      default : "unseen"
    },
    question_revisit :{
      type : Boolean,
      default : false
    }
  }
    
  ],
})

module.exports = mongoose.model("User_Test", schema)

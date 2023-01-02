const mongoose = require("mongoose")
const schema = mongoose.Schema({
  userId : Number,
  questionsList : [String],
  AnsweredQuestionsList : [String],
  testList : [String],
  paperList : [String]
})


module.exports = mongoose.model("Detail", schema)

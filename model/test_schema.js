const mongoose = require("mongoose")
const Schema = mongoose.Schema

const schema = mongoose.Schema({
  name: String,
  time: {
    startTime: Date,
    endTime: Date,
  },
  questions: [{
    _id: { type: Schema.Types.ObjectId, ref: 'Question' },
    sorting: {
      type: Number,
      default: 1000
    }
  }],
})

module.exports = mongoose.model("Test", schema)

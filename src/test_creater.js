const Test = require("../model/test_schema")
const Question = require("../model/question")

async function Test__creator__middleware(req, res, next){
  try {
    let test_name = "Mock Test-"
    let doc = (await Test.find()).length
    test_name+= doc;
    let startTime = req.body.startTime
    let endTime = req.body.endTime

    let questions = await Question.find().sort({subject : -1}).select(_id)

    
  } catch (error) {
    next(error)
  }
}
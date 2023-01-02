const Question = require("../model/question")
const UserTest = require("../model/user_test_schema")

async function test__description__middlware(req, res, next){
  try {
  
    let test_id = req.params.test_id
    let doc = await UserTest.findById(test_id)
    // console.log(doc)
    let total_questions =  doc.questions.length
    let answered =0
    let correct_answered = 0
    for(let i =0; i < total_questions ; i++){
      let question = doc.questions[i]
      if(question.user_answer !== "no"){
        answered++;
        let question_ans = (await Question.findById(question._id)).ans
        if( question.user_answer === question_ans){
          correct_answered++;
        }
      }
    }

    doc.attempted = 2
    doc.save()
    
    let percentage = ((correct_answered/total_questions) * 100).toFixed(2)
    res.render("pages/test_result", {
      test_id,
      total_questions ,
      answered,
      correct_answered,
      wrong_answered : answered - correct_answered,
      percentage

    })
    
  } catch (error) {
    next(error)
  }
}

module.exports = test__description__middlware
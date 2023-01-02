const UserTest = require("../model/user_test_schema")
const Test = require("../model/test_schema")
const Question = require("../model/question")
async function user__demo__test__ready__to__solve(req, res, next) {
  try {
    console.log(req.user, req.params)
    const testId = req.params.test_id
    let user_test = await UserTest.findOne({ user_id: req.user._id, test_id : testId })
    if (!user_test) {
      let test = await Test.findOne({ _id : testId })
      
      let test_name = test.name
      let test_id = test._id
      let questions = test.questions
      user_test = new UserTest({
        user_id: req.user._id, test_name, test_id, questions
      })
      user_test = await user_test.save()
    } else {
      if(user_test.attempted === 2){
        res.redirect(`/user/test/${user_test._id}/submit`)
      } else {
        user_test.attempted = 1;
        user_test.save()
        alpha(user_test.questions).then(questions => {
          res.render("pages/test", {
            pageTitle: user_test.test_name,
            questions: questions,
            test_id : user_test._id
          })
        })
      }
    }
   
  } catch (error) {
    next(error)
  }
}

module.exports = user__demo__test__ready__to__solve

async function alpha(array) {
  for (let i = 0; i < array.length; i++) {
    let question = await Question.findById(array[i]._id)
    array[i].photoUrl = question.photoUrl
  }

  return array
}
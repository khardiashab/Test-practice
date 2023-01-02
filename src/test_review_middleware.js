const UserTest = require("../model/user_test_schema")
const Question = require("../model/question")


async function test__review__middlware(req, res, next) {
  try {

    let user_test = await UserTest.findById(req.params.test_id)
    if (user_test.attempted != 2) {
      res.redirect(`/user/test/${user_test._id}`)
    } else {
      alpha(user_test.questions).then(questions => {
        res.render("pages/test", {
          pageTitle: user_test.test_name,
          questions: questions,
          test_id: user_test._id
        })
      })
    }

  } catch (error) {
    next(error)
  }
}

module.exports = test__review__middlware

async function alpha(array) {
  for (let i = 0; i < array.length; i++) {
    let question = await Question.findById(array[i]._id)
    array[i].photoUrl = question.photoUrl
    array[i].real_answer = question.ans
  }

  return array
}
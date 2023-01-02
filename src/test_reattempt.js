const UserTest = require("../model/user_test_schema")

module.exports = test__reattempt

async function test__reattempt(req, res, next) {
  try {
    let test_id = req.params.test_id
    let user_test = await UserTest.findByIdAndUpdate(test_id ,
      {
        $set: {
          attempted: 0,
          "questions.$[].user_answer": "no",
          "questions.$[].question_status": "unseen",
          "questions.$[].question_revisit": false
        }
      })
    test_id = user_test.test_id
    res.redirect(`/user/test/${test_id}`)
  } catch (error) {
    next(error)
  }
}
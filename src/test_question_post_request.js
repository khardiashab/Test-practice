const UserTest = require("../model/user_test_schema")
async function test__question__post__middlware(req, res, next) {
  try {
    let question_id = req.body.question_db_id
    // console.log(question_id)
    // console.log(req.body)
    let { question_ans, question_status, question_revisit_status, } = req.body
    let set = {
      $set: {
        "questions.$.user_answer": question_ans,
        "questions.$.question_status": question_status,
        "questions.$.question_revisit": question_revisit_status
      }
    }

    const questionUpdated = await UserTest.updateOne(
      { _id: req.params.test_id, "questions._id": question_id },
      set, 
      )
      console.log(questionUpdated)
    res.send({ message: "successfully saved" })

  } catch (error) {
    next(error)
  }
}

module.exports = test__question__post__middlware
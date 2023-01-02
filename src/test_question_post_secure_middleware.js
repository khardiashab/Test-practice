const UserTest = require("../model/user_test_schema")

async function test__question__post__secure__middleware(req, res, next){
  let test_id = req.params.test_id
  if((await UserTest.findById(test_id)).attempted === 2){
    res.redirect(`/user/test/${test_id}/review`)
  } else next()
}

module.exports = test__question__post__secure__middleware
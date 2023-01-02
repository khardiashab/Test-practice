const UserTest = require("../model/user_test_schema")

async function test__attempt__middlware(req, res, next){
  try{
    let test_id = req.params.test_id
    let doc = (await UserTest.findById(test_id)).attempted
    doc != 2 ? res.redirect(`/user/test/${test_id}`) : next()
  } catch(error) {
    next(error)
  }
}

module.exports = test__attempt__middlware
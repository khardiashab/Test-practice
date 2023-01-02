const router = require("express").Router()
const Question = require("../model/question")
const user__demo__test__ready__to__solve = require("../src/user_demo_test_ready_to_solve")
const test__question__post__middlware = require("../src/test_question_post_request")

const test__review__middlware = require("../src/test_review_middleware")

const test__description__middlware = require("../src/test_description_middlware")
const test__reattempt = require("../src/test_reattempt")

const test__question__post__secure__middleware = require("../src/test_question_post_secure_middleware")
const user__home = require("../src/user_home")


router.get("/", user__home)

router.get("/practice" , async (req, res, next) =>{
  let doc = await Question.aggregate([
    {$match : {ans : {$ne : ""}}},
    { $group: { _id: '$subject', count: { $sum: 1 } } }])
  let unQs = (await Question.find({ ans: "" })).length


  res.render("pages/practice", {
    unAnsweredQuestions: unQs,
    question_Summary_Array: doc
  })

})

router.post("/practice" , async(req, res, next) =>{
  console.log(req.body)
  res.send("Your request have got.")
})


router.get("/test/:test_id", user__demo__test__ready__to__solve)

router.post("/test/:test_id/question/save", test__question__post__secure__middleware, test__question__post__middlware)

router.get("/test/:test_id/submit", test__description__middlware)

router.get("/test/:test_id/review", test__review__middlware)

router.get("/test/:test_id/reattempt", test__reattempt)


module.exports = router
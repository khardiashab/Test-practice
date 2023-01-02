const router = require("express").Router()
const admin = require("../model/admin")
const Question = require("../model/question")
const multer = require("multer")
const { diskStorage } = require("multer")
const fs = require("fs")
const fse = require("fs-extra")
const path = require('path')
const sharp = require("sharp")
const question = require("../model/question")
const { bufferUpload, deleteFile } = require("../config/cloudiary")





// / admin homepage
router.get("/home", async (req, res) => {

  let doc = await Question.aggregate([{ $group: { _id: '$subject', count: { $sum: 1 } } }])
  let unQs = (await Question.find({ ans: "" })).length


  res.render("admin-pages/home", {
    unAnsweredQuestions: unQs,
    question_Summary_Array: doc
  })
})
// add question get request 
router.get("/add-question", (req, res) => {
  res.render("admin-pages/add-question")
})


const Storage = multer.memoryStorage()
const upload = multer({ storage: Storage })


router.post("/add-question/:image_name", upload.single("images"), async (req, res, next) => {
  try {
    console.log(req.body)
    let subject = req.body.subject
    let result = await bufferUpload(req.file.buffer)
    let photoId = result.public_id
    let photoUrl = result.url
    await Question.create({
      subject, photoId, photoUrl
    }).then(console.log)
    req.flash("success_msg", "Upload Successfully")
    res.status(200).send(result.public_id)




  } catch (error) {
    console.log(error)
    next(error)
  }
})





//  questions pager
router.get("/questions", async (req, res) => {

  let doc = await Question.find({ ans: "" }).sort({'_id': -1})
  let subject = await Question.find({ ans: { $ne: "" } }).distinct("subject")
  let questions = await Question.find({ ans: { $ne: "" } })

  res.render("admin-pages/questions", {
    questions: doc,
    subject: subject,
    answeredQuestions: questions
  })
})


// 

router.post("/edit-question/:id", async (req, res) => {
  let id = req.params
  // console.log( req.body)
  if (req.body.submit === 'Delete') {
    await deleteFile(req.body.imgName)
    await Question.deleteOne({ _id: id.id })
    res.redirect("/admin/questions")
  } else {
    await Question.updateOne({ _id: id.id },
      {
        $set: {
          subject: req.body.subject,
          ans: req.body.ans
        }
      })
    res.send({ msg: "Question Succfully Edited." })
  }
})


router.post("/remove-question/:id", async (req, res) => {
  let id = req.params
  await Question.updateOne({ _id: id.id },
    {
      $set: {
        ans: ''
      }
    })
  res.send({ msg: "Succfully removed." })
})

module.exports = router
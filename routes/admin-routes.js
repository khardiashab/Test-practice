const router = require("express").Router()
const admin = require("../model/admin")
const Question = require("../model/question")
const multer = require("multer")
const imageSizeReducer = require("../config/image-resizer")
const { uploadFile, deleteFile } = require("../config/google-api")
const { diskStorage } = require("multer")
const fs = require("fs")
const fse = require("fs-extra")
const path = require('path')
const sharp = require("sharp")





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

// add question post request
// multer middlware
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./public/uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, "img-" + Date.now() + '.' + file.originalname.split(".")[1])
  }
})

const upload = multer({ storage: storage })

// TAKINg post request for the question
router.post("/add-question", upload.array('images', 25), async (req, res) => {

  let filenameArray = []
  let Subject = req.body.subject.toLowerCase().trim()
  req.files.forEach(file => {
    filenameArray.push({
      subject: Subject,
      photoId: file.filename,
      photoUrl: ''
    })
  })


    for (let i of filenameArray) {
      const filePath = path.join(__dirname, `../public/uploads/`, i.photoId)
      const compressPath = path.join(__dirname, "../public/compressed/", `com-${i.photoId}`)
  
      let metaData = await sharp(filePath).metadata()
      // console.log(metaData)
      let width = metaData.width
      let height = metaData.height
      let ratio = width / height
  
      sharp(filePath).resize(400, parseInt(400 / ratio)).toFile(compressPath, async (err, info) => {
        if (err) {
          // console.log("this is error from sharp: ", err)
          req.flash("error_msg", err.message)
          res.redirect("/admin/add-question")
        } else {
          // console.log(info)
          await fse.remove(filePath)
          let details = await uploadFile(compressPath)
          // console.log(details)
          
          if(typeof details != 'undefined'){
            i.photoId = details.photoId
            i.photoUrl = details.photoUrl
              
          await fse.remove(compressPath)
          }
          // console.log(i)
          await Question.create(i)
        }
      })
    }
    // Question find and add 
    // await Question.insertMany(filenameArray)  

    req.flash("success_msg", "You have successfully added questions.")
    res.redirect("/admin/add-question")
  // let resize and upload imge on google and take the ulrid and photoId 
})


//  questions pager
router.get("/questions", async (req, res) => {

  let unAnsweredQuestions = []
  let doc = await Question.find({ ans: "" })
  let subject = await Question.find({ ans: { $ne: "" } }).distinct("subject")

  // console.log("admin.routes.js this is doc : ", doc)
  res.render("admin-pages/questions", {
    questions: doc,
    subject: subject
  })
})


// 

router.post("/edit-question/:id", async (req, res) => {
  let id = req.params
  console.log( req.body)
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
    res.redirect("/admin/questions")
  }
})

module.exports = router
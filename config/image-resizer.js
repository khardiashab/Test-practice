const sharp = require("sharp")
const path = require("path")

const filePath = path.join(__dirname, "../public/uploads/upload.jpg")
const compressPath = path.join(__dirname, "../public/compressed/", 'comp-file.jpg')

module.exports  = async (filePath)=> {
  let metaData = await sharp(filePath).metadata()


  // console.log(metaData)
  let width = metaData.width 
  let height = metaData.height 
  let ratio = width / height 
  

  sharp(filePath).resize(400, parseInt(400/ratio)).toFile(compressPath, (err, info) =>{
    if(err){
      console.log("this is error from sharp: " , err)
    } else{
      // console.log(info)
    }
  })
}
// imageReducer(filePath, compressPath)


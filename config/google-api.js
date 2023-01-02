const { google} = require("googleapis")
const path = require("path")
const fs = require("fs")

const oauthClient = new google.auth.OAuth2(
   process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
)

oauthClient.setCredentials({refresh_token : process.env.REFRESH_TOKEN})

const drive = google.drive({
  version : "v3",
  auth: oauthClient
})



module.exports = {
   uploadFile,
  deleteFile

}
async function uploadFile (filePath) {
  try {
    let response = await drive.files.create({
      requestBody : {
        name : "img-qest-1.jpg",
        mimeType : "image/jpg"
      },
      media : {
        mimeType : "image/jpg",
        body : fs.createReadStream(filePath)
      }
    })

    console.log(response.data.id)
    const fileId = response.data.id
    // console.log("this is fileId : ", fileId)
    await drive.permissions.create({
      fileId : fileId,
      requestBody : {
        role : "reader",
        type : "anyone"
      }
    })

    const result =  await drive.files.get({
      fileId : fileId,
      fields : "webViewLink"
    })
    // console.log("this is result >>", result.data)
    // let's return imageid and view id 
    let obj =  {
      photoId : fileId,
      photoUrl : `https://drive.google.com/uc?export=view&id=${fileId}`
    }

    return obj
    
  } catch (error) {
    console.log(error.message)
  }
}

// uploadFile();

// async function publicUrl(){
//   try {
//     const fileId = '1_01WMCfZX0g-nqeGWOLNt6MRBUQajVZe'
//     await drive.permissions.create({
//       fileId : fileId,
//       requestBody : {
//         role : "reader",
//         type : "anyone"
//       }
//     })

//     const result = await drive.files.get({
//       fileId : fileId,
//       fields : "webViewLink, webContentLink"
//     })

//     console.log(result.data)
    
//   } catch (error) {
//     console.log(error.message)
//   }
// }
// delete file 
async function deleteFile(fileId) {
  try {
    
    let response = await drive.files.delete({
      fileId : fileId,

    })
    // console.log(response.data, response.status)
    return (response.status)
  } catch (error) {
    console.log(error.message)
    return error.message

  }
}

// deleteFile()

// create public url 

// publicUrl()













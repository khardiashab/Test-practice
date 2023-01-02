const { authorize } = require("passport")
const { Readable} = require("stream")
const cloudinary = require("cloudinary").v2

module.exports = {bufferUpload, deleteFile}

cloudinary.config({
  cloud_name : process.env.CLOUD_NAME,
  api_key : process.env.API_KEY,
  api_secret : process.env.API_SECRECT
})

let uploads = (file, folder) =>{
  return new Promise (resolve => {
    cloudinary.uploader.upload(file ,  result =>{
      resolve({
        url : result.url,
        id : result.public_id
      }, {
        resource_type : authorize,
        folder : folder
      })
    })
  })
}

async function bufferUpload (buffer) {
  return new Promise((resolve, reject) => {
    const writeStream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
    const readStream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });
    readStream.pipe(writeStream);
  });
};

async function deleteFile(id){
  return new Promise((resolve, reject) =>{
    cloudinary.uploader.destroy(id, (err, result) =>{
      if(err){
        reject(err)
        return
      }
      resolve(result)
    })
  }) 
}

function is__valid(){
    if($("#select__subject option:selected").val() === "none"){
      $("#subject__error").removeClass("d-none")
      return false
    }
    if($("#file__input")[0].files.length ===0 ){
      $("#image__error").removeClass("d-none")
      return false
    }
    return true
}



$(document).ready(function () {
  
  

  $("#input__submit").click(function () {
    let subject = $("#select__subject option:selected").val()
    let files = $("#file__input")[0].files
    let length = files.length
    if(is__valid()){
      $(".uploading__effect__container").removeClass("d-none")

      let count = 0

      for (let file of files) {
        count++
        // console.log(file)
        let file_name = file.name
        // console.log(file_name)
        let reader = new FileReader()
        reader.readAsDataURL(file)
  
        reader.onload = (event) => {
          let image_url = event.target.result
          let image = document.createElement("img")
          image.src = image_url
          let width = 400
          image.onload = async e => {
            let ratio = e.target.width / width
            let canvas = document.createElement("canvas")
            canvas.width = width,
              canvas.height = e.target.height / ratio
            let context = canvas.getContext("2d")
            context.drawImage(image, 0, 0, canvas.width, canvas.height)
            context.canvas.toBlob(blob => {
              const data = new FormData()
              data.append(
                "images", blob
              )
              data.append("subject", subject )
              let image_count = count
             if(count === length){
              image_count = "last"
             }
  
              fetch(`/admin/add-question/image_${image_count}`,
               {
                method: "post",
                body: data
              }).then(response =>{
                console.log(response)
                if(response.status == 200){
                  let pending = length - count
                  $(".uploading__para").text(`Uploaded -> ${count}`)
                  $(".pending__para").text(`Pending -> ${pending}`)
                  if(pending=== 0){
                    success__function()
                  }
                }
              })
              .catch(err => console.log(err))
            }, "image/jpeg")
          }
        }
      }


      // $(".uploading__effect__container").addClass("d-none")

    }
  })
})

function _base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

function success__function(response){
  $(".uploading__effect__container").addClass("d-none")
  window.location.href = "/admin/questions"

}

function file__resize(file) {


  return new_file
}


let inputFile = document.getElementById("file__input")

inputFile.addEventListener("change", (event) =>{
  console.log((new Date()).now().isoString())
  let imageFiles = event.target.files 
  console.log(imageFiles.length)

  for(let i =0; i < imageFiles.length; i++){
    let image_file = imageFiles[i]

    let reader = new FileReader
    reader.readAsDataURL(image_file)

    reader.onload = (event) =>{
      let image_url = event.target.result

      let width = 400
     
      let image = document.createElement("img")
      image.src = image_url
      image.onload = (e)=> {
        let ratio = width/e.target.width
        let canvas  = document.createElement("canvas")
        canvas.width = width
        canvas.height = e.target.height * ratio

        let context = canvas.getContext("2d")
        context.drawImage(image, 0, 0, canvas.width, canvas.height)

        let new_image_url = context.canvas.toDataURL("image/jpeg" , 80)

        let div = document.createElement("div")
        div.classList = "col"
        let new_image = document.createElement("img")
        new_image.src = new_image_url
        console.log(i)
        // image.width = "300px"
        // image.height = "400px"
        div.append(new_image)
        document.getElementById("wrapper").append(div)

















      }

    }
  }
})
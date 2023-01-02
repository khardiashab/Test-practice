 

let toggler = () => {

  let ele = document.getElementById("mydiv")
  // console.log(ele)
  ele.classList.toggle("question-toggle-class")
  // ele.classList.toggle("mystyle")
}


var submit = '';
function formType(val) {
  submit = val
}





//  remove question from question page

$(document).ready(function () {

  let arr = document.querySelectorAll("form.question_editior_form")
  arr.forEach(ele => {
    $(ele).submit(event => {
      event.preventDefault()

      let ans = $(ele).find("input[type='radio']:checked").val()
      let subject = $(ele).find("input[name=subject]").val()
      let id = $(ele).children("input[name=id]").val()


      console.log(ans, subject, id)
      var queryString = $(ele).serialize();
      // console.log(queryString)

      if (submit == "Delete") {
        let imgName = $(ele).children("input[name=imgName]").val()
        if (confirm("Want To Delete this question?")) {
          $.post(`/admin/edit-question/${id}`,
            { submit, imgName }, (data) => {
              console.log(data)
              $(ele).prev().addClass("alert-success").css({ display: "block", }).text("Deleted Successfully.")
              $(ele).css("display", "none")

            })
        }
      } else {
        $.post(`/admin/edit-question/${id}`,
          { submit, subject, ans }, (data) => {
            console.log(data)
            $(ele).prev().addClass("alert-success").css({ "display": "block", }).text("Edited Successfully.")
            $(ele).css("display", "none")
          })
      }


    })
  })

  // let's work with removequestion container

  let remove_arr = document.querySelectorAll(".remove__question__container")

  remove_arr.forEach(que => {
    let id = $(que).find("input[type='hidden']").val()
    let button = $(que).find("button")

    $(button).on("click", function (event) {
      if (confirm("Want to remove this question")) {
        $.post(
          `/admin/remove-question/${id}`,
          {},
          (data) => {
            $(que).prev().addClass("alert-success").css({ "display": "block", }).text("Removed Successfully.")
            $(que).css("display", "none")
          })
      }
    })
  })


})
















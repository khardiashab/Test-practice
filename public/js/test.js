function question__container__id(number) {
  number = Number(number)
  return "#id__" + number
}
function answer__container__id(number) {
  number = Number(number)
  return "#answer__container__" + number
}
function question__number__container__id(number) {
  number = Number(number)
  return "#id__number__" + number
}

function question__number__container__clicked() {
  $(".question__number__container").each(function () {
    $(this).click(function () {
      let number = $(this).text().trim()
      let question_id = question__container__id(number)
      hide__all__question()

      if ($(question_id).attr("data-real-answer") === "no") {
        question__status__unseen__to__unanswered(question_id)
        option__show(question_id)
      }
      show__question(question_id)
      $("#panel").slideUp()
    })
  })
}

function save__and__next__btn__clicked() {
  $(".save__and__next").each(function () {
    $(this).click(function () {
      save__and__next($(this).attr("data-question-number"))
    })
  })
}

function save__and__next(question_number) {
  question_number = Number(question_number)
  let question_id = question__container__id(question_number)

  //  let me save first 
  save__ans__in__data__answer(question_id, answer__extractor(question_id))
  question__status__unanswered__to__answered(question_id)

  // save the post in backend 
  save__and__next__post(question_id)

  // let me show next question
  // ! first we check if there is a next question available or not.+
  // next__question(question_id)
  // let last_question_id = "#" + $(".question__container:last").attr("id")
  // console.log("this is last question_Id :", last_question_id)
  // if (question_id !== last_question_id) {
  //   hide__all__question()
  //   let next_question_id = question__container__id(question_number + 1)
  //   question__status__unseen__to__unanswered(next_question_id)
  //   show__question(next_question_id)
  //   option__show(next_question_id)
  // } else {
  //   console.log("This is last question")
  //   show__question(last_question_id)
  //   // show question number panel
  //   $("#panel").slideDown()
  // }
}

function next__question(question_id){
  if(!is__last__question(question_id)){
    hide__all__question()
    let next_question_id = "#" + $(question_id).next().attr("id")
    question__status__unseen__to__unanswered(next_question_id)
    show__question(next_question_id)
    option__show(next_question_id)
  } else {
    $("#panel").slideDown()
  }
}

function is__last__question(question_id){
  let last_question_id = "#" + $(".question__container:last").attr("id")
  if(question_id == last_question_id){
    return true
  } else return false
}


function option__remove__color__active(question_id) {
  $(question_id).find(".option__container").attr("data-option-active", "false")
  $(question_id).find(".option__container").removeClass("bg-secondary")
  $(question_id).find(".option__container").removeClass("option__clicked")
}

function option__show(question_id) {
  let ans = $(question_id).attr("data-answer")
  if (ans !== "no") {
    // first remove color and active from all options
    option__remove__color__active(question_id)

    // now showing color and active to that option
    $(question_id).find(".option__container").each(function () {
      if ($(this).attr("data-ans") === ans) {
        $(this).attr("data-option-active", "true")
        $(this).addClass("option__clicked")
      }
    })
  }
}

function show__question(question_id) {
  $(question_id).addClass('d-block')
}
function hide__all__question() {
  $(".question__container").removeClass("d-block")
}

function save__ans__in__data__answer(question_id, ans) {
  $(question_id).attr("data-answer", ans)
}

function answer__extractor(answer_container_id) {
  let ans = 'no'
  $(answer_container_id).find(".option__container").each(function () {
    if ($(this).attr("data-option-active") === "true") {
      ans = $(this).attr("data-ans")
    }
  })
  return ans
}



function option__clicked() {
  $(".option__container").each(function () {
    $(this).click(function () {
      let number = $(this).attr("data-question-number")
      let question_id = question__container__id(number)
      let real_answer = $(question_id).attr("data-real-answer")
      if (real_answer === "no") {
        $(this).siblings().removeClass("bg-secondary")
        $(this).siblings().attr("data-option-active", "false")
        $(this).addClass("bg-secondary")
        $(this).attr("data-option-active", "true")

      } else return false

    })
  })
}

function question__number__container__bg__color(question_id) {
  let status = question__status__extractor(question_id)
  let number = $(question_id).attr("data-question-number")
  let que_cont_id = question__number__container__id(number)
  if (status == "answered") {
    $(que_cont_id).removeClass("bg-secondary")
    $(que_cont_id).addClass("bg-primary")
  } else if (status === "unanswered") {
    $(que_cont_id).addClass("bg-secondary text-white")
  } else if (status === "unseen") {
    $(que_cont_id).removeClass("bg-secondary text-white")
    $(que_cont_id).removeClass("bg-primary")
  }

  else if (status == "revisit") {
    $(que_cont_id).removeClass("bg-secondary")
    $(que_cont_id).addClass("bg-info")
  }
}

function question__status__unseen__to__unanswered(question_id) {
  if ($(question_id).attr("data-question-status") === "unseen") {
    $(question_id).attr("data-question-status", "unanswered")
    question__number__container__bg__color(question_id, "unanswered")
  }
}
function question__status__unanswered__to__answered(question_id) {
  if ($(question_id).attr("data-answer") !== "no") {
    $(question_id).attr("data-question-status", "answered")
    question__number__container__bg__color(question_id, "answered")
  }
}

$(document).ready(function () {
  // sliding effect in test navbar
  $("#question-number").click(function () {
    $("#panel").slideToggle()
  })
  $("#flip").click(function () {
    $("#panel").slideUp()
  })

  $(".question__container:first").addClass("d-block")
  $(".question__container:last").find(".save__and__next").text("Save")
  if ($(".question__container:first").attr("data-question-status") === "unseen") {
    $(".question__container:first").attr("data-question-status", "unanswered")
  }
  question__number__container__show()
  option__show("#id__1")
  save__and__next__btn__clicked()
  question__number__container__clicked()
  option__clicked()
  dismiss__ans__clicked()
  submit__clicked()
  review__show__function()
})

function question__number__container__show() {
  $(".question__container").each(function () {
    let number = $(this).attr("data-question-number")
    let question_id = question__container__id(number)
    question__number__container__bg__color(question_id)
  })
}

// let me handle post request for save and next
function save__and__next__post(question_id) {
  let user_test_id = $('#questions__box').attr("data-user-test-id")
  let question_db_id = question__id__extractor(question_id)

  let question_ans = question__ans__extractor(question_id)
  let question_status = question__status__extractor(question_id)
  let question_revisit_status = question__revisit__status__extractor(question_id)

  let url = `/user/test/${user_test_id}/question/save`

  $.post(url,
    { question_db_id, question_ans, question_status, question_revisit_status },
    (data_from_db) => {
      // console.log(data_from_db)
      next__question(question_id)
      
    })
}

function question__ans__extractor(question_id) {
  return $(question_id).attr("data-answer")
}

function question__status__extractor(question_id) {
  return $(question_id).attr("data-question-status")
}
function question__id__extractor(question_id) {
  return $(question_id).attr("data-question-id")
}
function question__revisit__status__extractor(question_id) {
  return $(question_id).attr("data-revisit-status")
}



// -------------------------------------------------
// LET HANDLE UNDO BUTTON CLICK 
// first option  active to false 
// option color removed 
// change answer to no
// change status to unanswered
// change question number container false

function dismiss__ans__clicked() {
  $(".dissmiss__ans").each(function () {
    $(this).click(function () {
      let number = $(this).attr("data-question-number")
      let question_id = question__container__id(number)
      let ans = question__ans__extractor(question_id)
      option__remove__color__active(question_id)
      if (ans === "no") {
        // there is no need for change 
        return false
      } else {
        $(question_id).attr("data-answer", "no")
        $(question_id).attr("data-question-status", "unanswered")
        question__number__container__bg__color(question_id)
        save__and__next__post(question_id)
      }
    })
  })
}



// ----------------------------------------------------------
// let's handle submit request

function submit__clicked() {
  $(".submit").each(function () {
    $(this).click(function () {
      if (confirm("You can't resume after submiting the paper.")) {

        $("#submit__container").removeClass("d-none")
        let div = $("#animate__submit")
        function animate() {
          div.animate({ height: '300px', opacity: '0.4' }, "slow");
          div.animate({ width: '100vw', opacity: '0.8' }, "slow");
          div.animate({ height: '100px', opacity: '0.4' }, "slow");
          div.animate({ width: '100px', opacity: '0.8', backgroundColor: "purple" }, "slow");
        }
        setInterval(animate, 500);
      }
    })
  })
}
// ------------------------------------------------------------
// ! handle the option show in the review seciton 

function question__real__ans__extractor(question_id) {
  return $(question_id).attr("data-real-answer")
}

function option__color__giver(question_id, ans, isTrue) {
  $(question_id).find(".option__container").removeClass("option__clicked bg-secondary")
  $(question_id).find(".option__container").each(function () {
    if ($(this).attr("data-ans") === ans) {
      if (isTrue) {
        $(this).addClass("bg-success text-white")
      } else {
        $(this).addClass("bg-danger text-white")
      }
    }
  })


}

function question__color__giver(question_id, isTrue) {
  if (isTrue) {
    $(question_id).addClass("question__right")
  } else {
    $(question_id).addClass("question__wrong")
  }

}

function question__number__container__color__show(question_id, isTrue) {
  let number = $(question_id).attr("data-question-number")
  let qs_con_id = question__number__container__id(number)
  $(qs_con_id).removeClass("bg-primary bg-info")
  if (isTrue) {
    $(qs_con_id).addClass("bg-success")
  } else {
    $(qs_con_id).addClass("bg-danger")
  }
}

function review__show(question_id) {
  let ans = question__ans__extractor(question_id)
  let real_ans = question__real__ans__extractor(question_id)
  if(real_ans !== "no"){
    // let's call save and next function for first 
    $(".question__container:first").find(".previous").addClass("d-none")
    $(".question__container:last").find(".next").addClass("d-none")

    if (ans === real_ans) {
      question__color__giver(question_id, true)
      option__color__giver(question_id, ans, true)
      question__number__container__color__show(question_id, true)
    } else if (ans === 'no') {
      option__color__giver(question_id, real_ans, true)
    } else {
      // 
      question__color__giver(question_id, false)
      option__color__giver(question_id, ans, false)
      option__color__giver(question_id, real_ans, true)
      question__number__container__color__show(question_id, false)
    }

    next(question_id)
    previous(question_id)
  }

}

function review__show__function() {
  $(".question__container").each(function () {
    let question_id = "#" + $(this).attr("id")
    review__show(question_id)
  })
}

function next(question_id){
  $(question_id).find(".next").click( function(){
    hide__all__question()
    $(question_id).next().addClass("d-block")

  })
}
function previous(question_id){
  $(question_id).find(".previous").click( function(){
    hide__all__question()
    $(question_id).prev().addClass("d-block")

  })
}





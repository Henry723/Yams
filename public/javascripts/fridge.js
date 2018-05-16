
/************** Easter Egg *************************/
$( document ).ready(function() {


  $("#addSubmitForm").submit(function(e){
    var inputValue = $("#foodNameInput").val();
    if(inputValue == "Adam" || inputValue == "Uni" || inputValue == "Jay"
    || inputValue == "Hayden" || inputValue == "Henry"){
      $("#easterModal").modal({

      });
      e.preventDefault();
    }
  });
  /********************** nav bar  ********************/

  $("#aboutPageAnchor").click(function(e){
    e.stopPropagation();
    toggleDoor();
    $("#aboutPage").show();
    $("#userPage").hide();
    $("#scanPage").hide();
    $("#addPage").hide();
    $("#notificationSettingPage").hide();

  });

  $("#userPageAnchor").click(function(e){
    e.stopPropagation();
    toggleDoor();
    $("#aboutPage").hide();
    $("#userPage").show();
    $("#scanPage").hide();
    $("#addPage").hide();
    $("#notificationSettingPage").hide();
  });

  $("#scanPageAnchor").click(function(e){
    e.stopPropagation();
    toggleDoor();
    $("#aboutPage").hide();
    $("#userPage").hide();
    $("#scanPage").show();
    $("#addPage").hide();
    $("#notificationSettingPage").hide();
  });

  $("#addPageAnchor").click(function(e){
    e.stopPropagation();
    toggleDoor();
    $("#aboutPage").hide();
    $("#userPage").hide();
    $("#scanPage").hide();
    $("#addPage").show();
    $("#notificationSettingPage").hide();
  });


  /******************* notification button  ********************/
  $("#notificationPageAnchor").click(function(e){
    e.stopPropagation();
    toggleDoor();
    $("#aboutPage").hide();
    $("#userPage").hide();
    $("#scanPage").hide();
    $("#addPage").hide();
    $("#notificationSettingPage").show();
  });

  /********************** user page  ********************/


  $(".deleteButton").click(function(event) {
    var parentTag = event.target.parentNode;
    var foodName = parentTag.firstChild.nextSibling.innerText;

    var foodData = { food: foodName.slice(0, foodName.indexOf(' ')) };
    this.parentNode.remove();

    $.ajax({
      url: "/fridge/delete",
      type: "DELETE",
      dataType: 'json',
      contentType: "application/json",
      data: JSON.stringify(foodData),
      success: function (result) {
        console.log("deleted.");
      },
      error: function (status) {
        console.log(status);
      }
    });
  });

  $("p.progressBarContent").width($("div.progressBar").width());

 function toggleDoor(){
   if($("li.links, .fridgeDoor h1").is(':visible')){
       $("li.links, .fridgeDoor h1").fadeOut('fast');
    }
    else{
       $("li.links, .fridgeDoor h1").fadeIn('slow');
    }
    setTimeout(function()
    {
      $(".fridgeDoor").toggleClass("closedDoor").toggleClass("openDoor");
      $("div.handle").toggleClass("openDoorHandle").toggleClass("closedDoorHandle");
    }, 100);
 }
  $(".fridgeDoor").click(function(){
    toggleDoor();
  });




  /**********************header timer***********************/

  /*var didScroll;
  // on scroll, let the interval function know the user has scrolled
  $(window).scroll(function(event){
  didScroll = true;
});
// run hasScrolled() and reset didScroll status
setInterval(function() {
if (didScroll) {
$("#headerNav").slideDown(500);
didScroll = false;
}
}, 250);

setInterval(function() {
$("#headerNav").slideUp(500)
}, 6000);
*/
// var iScrollPos = 0;
//
// $(window).scroll(function () {
//   var iCurScrollPos = $(this).scrollTop();
//   if (iCurScrollPos > iScrollPos) {
//     //Scrolling Down
//     $(".scrollHidden").slideUp(100)
//   } else {
//     //Scrolling Up
//     $(".scrollHidden").slideDown(100);
//   }
//   iScrollPos = iCurScrollPos;
// });





});

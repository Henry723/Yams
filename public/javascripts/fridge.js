
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
//        e.preventDefault();
        $("#aboutPage").show();
        $("#userPage").hide();
        $("#scanPage").hide();
        $("#addPage").hide();
        $("#notificationPageAnchor").hide();
        $("#notificationSettingPage").hide();
    });

    $("#userPageAnchor").click(function(e){
//        e.preventDefault();
        $("#aboutPage").hide();
        $("#userPage").show();
        $("#scanPage").hide();
        $("#addPage").hide();
        $("#notificationPageAnchor").show();
        $("#notificationSettingPage").hide();
    });

    $("#scanPageAnchor").click(function(e){
//        e.preventDefault();
        $("#aboutPage").hide();
        $("#userPage").hide();
        $("#scanPage").show();
        $("#addPage").hide();
        $("#notificationPageAnchor").hide();
        $("#notificationSettingPage").hide();
    });

    $("#addPageAnchor").click(function(e){
//        e.preventDefault();
        $("#aboutPage").hide();
        $("#userPage").hide();
        $("#scanPage").hide();
        $("#addPage").show();
        $("#notificationPageAnchor").hide();
        $("#notificationSettingPage").hide();
    });


/******************* notification button  ********************/
     $("#notificationPageAnchor").click(function(e){
//        e.preventDefault();
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

        var foodData = { food: foodName };
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

    var iScrollPos = 0;

       $(window).scroll(function () {
           var iCurScrollPos = $(this).scrollTop();
           if (iCurScrollPos > iScrollPos) {
               //Scrolling Down
               $("#headerNav").slideUp(500)
           } else {
              //Scrolling Up
              $("#headerNav").slideDown(180);
           }
           iScrollPos = iCurScrollPos;
       });




});

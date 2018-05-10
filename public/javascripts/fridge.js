

$( document ).ready(function() {

/********************** nav bar  ********************/
  $("#aboutPageAnchor").click(function(e){
//        e.preventDefault();
        $("#aboutPage").show();
        $("#userPage").hide();
        $("#scanPage").hide();
        $("#addPage").hide();
    });
    
    $("#userPageAnchor").click(function(e){
//        e.preventDefault();
        $("#aboutPage").hide();
        $("#userPage").show();
        $("#scanPage").hide();
        $("#addPage").hide();
    });

    $("#scanPageAnchor").click(function(e){
//        e.preventDefault();
        $("#aboutPage").hide();
        $("#userPage").hide();
        $("#scanPage").show();
        $("#addPage").hide();
    });

    $("#addPageAnchor").click(function(e){
//        e.preventDefault();
        $("#aboutPage").hide();
        $("#userPage").hide();
        $("#scanPage").hide();
        $("#addPage").show();
    });

/********************** user page  ********************/
    $("#button1").click(function(e){
        e.preventDefault();
        $("#myDropdown1").toggle();
    });

    $("#button2").click(function(e){
        e.preventDefault();
        $("#myDropdown2").toggle();
    });

    $("#button3").click(function(e){
        e.preventDefault();
        $("#myDropdown3").toggle();
    });

    $("#button4").click(function(e){
        e.preventDefault();
        $("#myDropdown4").toggle();
    });

    $(".deleteButton").click(function(event) {
        var parentTag = event.target.parentNode;
        var foodName = parentTag.innerText.slice(0, parentTag.innerText.length - 1);

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
    
    $("#submit").click(function(){
        if ($("input[name*='food']").val("adam")) {
            console.log("adam");
        }
    })
});

/********************** scan  ********************/

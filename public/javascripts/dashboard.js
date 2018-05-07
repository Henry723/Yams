

$( document ).ready(function() {

/********************** nav bar  ********************/
    $("#userPageAnchor").click(function(e){
//        e.preventDefault();
        $("#userPage").show();
        $("#scanPage").hide();
        $("#addPage").hide();
    });

    $("#scanPageAnchor").click(function(e){
//        e.preventDefault();
        $("#userPage").hide();
        $("#scanPage").show();
        $("#addPage").hide();
    });

    $("#addPageAnchor").click(function(e){
//        e.preventDefault();
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
        var clickedItem = event.target.parentNode;
        var foodName = clickedItem.getElementsByClassName("btn eachFoodName")[0].innerHTML;
        var foodData = { food: foodName };
        this.parentNode.remove();
        $.ajax({
            url: "/dashboard/delete",
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
});

/********************** scan  ********************/

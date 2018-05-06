

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

    $("deleteButton").click(function(){
        //Ajax call
    });
});

/********************** scan  ********************/

$(document).ready
(
    function ()
    {
        
        
        /******************* Easter Egg ********************/

        $("#addSubmitForm").submit
        (
            function (e)
            {
                var inputValue = $("#foodNameInput").val();

                if (inputValue == "Adam" || inputValue == "Uni" || inputValue == "Jay"
                    || inputValue == "Hayden" || inputValue == "Henry")
                {
                    $("#easterModal").modal({});
                    e.preventDefault();
                }
            }
        );

        /********************** nav bar  ********************/

        $("#aboutPageAnchor").click
        (
            function (e)
            {
                e.stopPropagation();
                toggleDoor();
                $("#aboutPage").show();
                $("#userPage").hide();
                $("#scanPage").hide();
                $("#addPage").hide();
                $("#notificationSettingPage").hide();
            }
        );

        $("#userPageAnchor").click
        (
            function (e)
            {
                e.stopPropagation();
                toggleDoor();
                $("#aboutPage").hide();
                $("#userPage").show();
                $("#scanPage").hide();
                $("#addPage").hide();
                $("#notificationSettingPage").hide();
            }
        );

        $("#scanPageAnchor").click
        (
            function (e)
            {
                e.stopPropagation();
                toggleDoor();
                $("#aboutPage").hide();
                $("#userPage").hide();
                $("#scanPage").show();
                $("#addPage").hide();
                $("#notificationSettingPage").hide();
            }
        );

        $("#addPageAnchor").click
        (
            function (e)
            {
                e.stopPropagation();
                toggleDoor();
                $("#aboutPage").hide();
                $("#userPage").hide();
                $("#scanPage").hide();
                $("#addPage").show();
                $("#notificationSettingPage").hide();
            }
        );

        /******************* notification button  ********************/

        $("#notificationPageAnchor").click
        (
            function (e)
            {
                e.stopPropagation();
                toggleDoor();
                $("#aboutPage").hide();
                $("#userPage").hide();
                $("#scanPage").hide();
                $("#addPage").hide();
                $("#notificationSettingPage").show();

            }
        );

        /********************** user page  ********************/

        
        
        $(".deleteButton").click
        (
            function (event)
            {
                var parentTag = event.target.parentNode;
                var foodName = parentTag.firstChild.nextSibling.innerText;

                var foodData = { food: foodName.slice(0, foodName.indexOf(' ')) };
                this.parentNode.remove();

                $.ajax
                (
                    {
                        url: "/fridge/delete"
                        , type: "DELETE"
                        , dataType: 'json'
                        , contentType: "application/json"
                        , data: JSON.stringify(foodData)
                        , success: function (result) { console.log("deleted."); }
                        , error: function (status) { console.log(status); }
                    }
                );
            }
        );

        $("p.progressBarContent").width($("div.progressBar").width());

        function toggleDoor()
        {
            if ($("li.links, .fridgeDoor h1, .footerStuff").is(':visible'))
            {
                $("li.links, .fridgeDoor h1, .footerStuff").fadeOut('fast');
            }
            else
            {
                $("li.links, .fridgeDoor h1, .footerStuff").delay('100').fadeIn('2000');
            }

            setTimeout
            (
                function ()
                {
                    $(".fridgeDoor").toggleClass("closedDoor").toggleClass("openDoor");
                    $(".handle").toggleClass("openDoorHandle").toggleClass("closedDoorHandle");
                }
                , 100
            );
        }

        $(".fridgeDoor").click(function(){ toggleDoor(); });

        // flash messages for adding items.
  
        setTimeout(function() { $('.alert').fadeOut(1500); }, 2000);
        
        
            
        $(".overlayDiv").on("swipeleft", swipeHandler);
        function swipeHandler(event){
            $(".deleteButton").animate({width:'0'},100),
            $(".deleteButton").css("padding", "0"),    
            $(".deleteButton").text("");
            
            $(event.target).css("width", "83%"),
            $(event.target).prev().show(),
            $(event.target).prev().animate({width:'20%'},100),
            $(event.target).prev().text("Delete");
        }
        
        $(".overlayDiv").mousedown(function(event){
            $(event.target).css("width", "100%"),
            $(event.target).prev().animate({width:'0'},100),
            $(event.target).prev().css("padding", "0"),    
            $(event.target).prev().text("");
        });
        
        $(".overlayDiv").on("swiperight", function(event){
            $(event.target).css("width", "100%"),
            $(event.target).prev().animate({width:'0'},100),
            $(event.target).prev().css("padding", "0"),    
            $(event.target).prev().text("");
        });
            
            
        
        
        
    }
);




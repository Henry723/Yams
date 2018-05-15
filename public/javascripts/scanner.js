$(document).ready(function () {

    var encodedImage = "";
    var newReceiptFoodData;


    function previewFile() {
        var preview = document.querySelector('img');
        var file = document.querySelector('input[type=file]').files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function () {
            preview.src = reader.result;
            var commaPlace;
            for (var i = 0; i < reader.result.length; i++) {
                if (reader.result[i] === ',') {
                    commaPlace = i + 1;
                }
            }
            encodedImage = reader.result.substring(commaPlace);
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    $("#imageInput").on("change", previewFile);
    $("#scanSubmit").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if ($("#scanPlaceholder").attr("src") != "../images/file.png") {
            $('#loaderModal').modal('show');
            var formData = {
                "requests": [
                    {
                        "image": {
                            "content": encodedImage
                        },
                        "features": [
                            {
                                "type": "DOCUMENT_TEXT_DETECTION"
                            }
                        ]
                    }
                ]
            }
            $.ajax({
                type: "POST",
                url: "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDapb1kWk-XwMPyyjW1ddX66nwH6L-fXxo",
                data: JSON.stringify(formData),
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    if ('fullTextAnnotation' in data.responses[0]) {
                        newReceiptFoodData = data.responses[0].fullTextAnnotation.text;

                        $.ajax({
                            type: "GET",
                            url: "/fridge/allFoods",
                            success: function (data) {

                                $("#close-loader").trigger("click");
                                var allFoods = data.foods;
                                var receiptDataText = newReceiptFoodData.toUpperCase();

                                $("#scannerForm form").empty();
                                var d = new Date();
                                d.setDate(d.getDate() + 14);
                                var fData = "";
                                for (var i = 0; i < allFoods.length; i++) {
                                    var foodName = allFoods[i][0].value;
                                    var expiryDate = allFoods[i][1].value;

                                    if (receiptDataText.includes(foodName.toUpperCase())) {

                                        var dm = ((d.getMonth() + 1) > 9) ? (d.getMonth() + 1) : "0" + (d.getMonth() + 1);
                                        var dd = (d.getDate() > 9) ? d.getDate() : "0" + d.getDate();
                                        var dateStr = d.getFullYear() + "-" + dm + "-" + dd;


                                        var dateInstance = new Date();
                                        var minDate = "" + dateInstance.getFullYear();
                                        minDate += (dateInstance.getMonth() + 1) >= 10 ? "-" + (dateInstance.getMonth() + 1) : "-0" + (dateInstance.getMonth() + 1);
                                        minDate += dateInstance.getDate() + 1 >= 10 ? "-" + (dateInstance.getDate() + 1) : "-0"(+ dateInstance.getDate() + 1);

                                        fData += "<div class='row'><div class='col-4'><input name='foodName' type='text' readonly class='form-control-plaintext' value='" +
                                            foodName + "' required></div><div class='col-6'><input name='expiryDate' type='date' class='form-control' value='" + dateStr +
                                            "' min='" + minDate + "'required></div><div class='col-2'><button type='button' class='btn btn-danger scannerDelete'> X </button></div></div>";
                                    }
                                }

                                if (fData) {
                                    $("#scannerForm form").append(fData + "<button id='scannerFormSubmit' type='submit' class='mt-4 btn btn-large'>Submit</button>");
                                    $("#scannerForm").show();
                                    
                                    $(".scannerDelete").click(function(event) {
                                        var parentTag = event.target.parentNode;
                                        //var foodName = parentTag.firstChild.nextSibling.innerText;
                                        console.log("it's working");
                                        //this.parentNode.remove();
                                    });
    
                                }

                                else {
                                    alert("No item matches!");
                                    $("#close-loader").trigger("click");
                                }

                            }
                        });
                    } else {
                        alert("No text in photo!");
                        $("#close-loader").trigger("click");
                    }
                }
            });
        }
    });
    
    /********************** scan  ********************/
    
   
     
});

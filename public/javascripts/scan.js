$( document ).ready(function() {

  var encodedImage = "";
  var newReceiptFoodData;

  function previewFile() {
    var preview = document.querySelector('img');
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();

    reader.addEventListener("load", function () {
      preview.src = reader.result;
      var commaPlace;
      for (var i = 0; i < reader.result.length; i++){
        if (reader.result[i] === ','){
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
  $("#submit").on("click", function(e){
    e.preventDefault();
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
      success: function(data){
        newReceiptFoodData = data.responses[0].fullTextAnnotation.text;
        $.ajax({
          type: "GET",
          url: "/user/allFoods",
          success: function(data){
            var allFoods = data.foods;
            var receiptDataText = newReceiptFoodData.toUpperCase();
            $("#foodTable").empty();
            var tData = "";
            for (var key in allFoods){
              var item = allFoods[key];
              var num = parseInt(key) + 1;
              if (receiptDataText.includes(item.foodName.toUpperCase())){
                tData += "<tr><td>" + num + "</td><td>" + item.foodName.toUpperCase() +"</td><td>" + item.averageExpiryDate + "</td></tr>";
              }
            }
            $("#foodTable").append("<table><thead><tr><th scope='col'>#</th><th scope='col'>Name</th><th scope='col'>Expires in(days)</th></tr></thead><tbody>" + tData + "</tbody></table>");
            $("#foodTable").show();
          }
        });
      }
    });

  });

});

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
        if ('fullTextAnnotation' in data.responses[0]){
          newReceiptFoodData = data.responses[0].fullTextAnnotation.text;
          $.ajax({
            type: "GET",
            url: "/dashboard/allFoods",
            success: function(data){
              $("#close-loader").trigger("click");
              var allFoods = data.foods;
              var receiptDataText = newReceiptFoodData.toUpperCase();
              $("#scannerForm form").empty();
              var fData = "";
              for (var key in allFoods){
                var item = allFoods[key];
                if (receiptDataText.includes(item.foodName.toUpperCase())){
                  // fData += "<tr><td>" + num + "</td><td>" + item.foodName.toUpperCase() +"</td><td>" + item.averageExpiryDate + "</td></tr>";
                  fData += "<div class='row'><div class='col'><input name='foodName' type='text' readonly class='form-control-plaintext' value='" + item.foodName.toUpperCase() + "' required></div><div class='col'><input name='expiryDate' type='number' class='form-control' value='" + item.averageExpiryDate + "' required></div></div>";
                }
              }
              $("#scannerForm form").append(fData + "<button type='submit' class='btn'>Submit</button>");
              $("#scannerForm").show();
            }
          });
        } else {
          $("#close-loader").trigger("click");
          alert("No text in photo!");
        }
      }
    });

  });

});

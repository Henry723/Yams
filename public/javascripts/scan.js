$( document ).ready(function() {

var encodedImage = "";

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
      // console.log(encodedImage);
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
        console.log(data.responses[0].fullTextAnnotation.text);
        var dataText = data.responses[0].fullTextAnnotation.text;
        var foods = ["SPINACH", "CARROTS", "GREEN PEPPERS", "CELERY", "MUSHROOMS", "MIXED PEPPERS", "POTATOES"]
        var tData = "";
        for (var key in foods){
          var num = parseInt(key) + 1;
          if (dataText.includes(key)){
            tData += "<tr><td>" + num + "</td><td>" + foods[key] + "</td></tr>";
          }
        }
        $("#foodTable").append("<table><thead><tr><th scope='col'>#</th><th scope='col'>Item</th></tr></thead><tbody>" + tData + "</tbody></table>");
        $("#foodTable").show();

      }
    });

  });

});

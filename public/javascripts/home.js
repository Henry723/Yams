$(document).ready(function(){
    $("#loginClick").click(function(){
        $("#mainForm").hide();
        $("#loginForm").show();
    });

    $("#registerClick").click(function(){
        $("#mainForm").hide();
        $("#registerForm").show();
    });

    $("#registerClickInSignin").click(function(){
        $("#loginForm").hide();
        $("#registerForm").show();
    });

    $("#loginClickInSignup").click(function(){
        $("#registerForm").hide();
        $("#loginForm").hide();
        $("#mainForm").show();
    });
    
    
    var password = document.getElementById("registerPassword")
    , confirm_password = document.getElementById("registerPasswordCheck");
    
    function validatePassword(){
        if(password.value != confirm_password.value) {
            confirm_password.setCustomValidity("Passwords Don't Match");
        } else {
            confirm_password.setCustomValidity('');
        }
    }
    
    password.onchange = validatePassword;
    confirm_password.onkeyup = validatePassword;
});

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
        $("#loginForm").show();
    });

});

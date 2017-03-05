$(document).ready(function(){
    publicDoorListen();
});

//登录页的一些监听
function publicDoorListen(){
    $('#signInBtn').click(function(){
        $('#signUpBtn').css('color','grey')    ;
        $('#signInBtn').css('color','black')    ;
        $('#signInForm').css('display','flex');
        $('#signUpForm').css('display','none');
    });
    $('#signUpBtn').click(function(){
        $('#signUpBtn').css('color','black')    ;
        $('#signInBtn').css('color','grey');
        $('#signInForm').css('display','none');
        $('#signUpForm').css('display','flex');
    });
}
$(document).ready(function(){
    publicDoorListen();
    //动态设置particles　div的高为屏幕高度   
    $('#particle-js').css('height',$(window).height()+'px');

    //随机设置背景特效
    randomBgStyle();
    
});

//登录页的一些监听
var publicDoorListen = function(){
    $('#logInBtn').click(function(){
        $('#signUpBtn').css('color','grey');
        $('#logInBtn').css('color','black');
        $('#logInForm').css('display','flex');
        $('#signUpForm').css('display','none');
    });
    $('#signUpBtn').click(function(){
        $('#signUpBtn').css('color','black');
        $('#logInBtn').css('color','grey');
        $('#logInForm').css('display','none');
        $('#signUpForm').css('display','flex');
    });
    //注册表单的邮箱格式验证
    $("#container .email").on({
        keyup: emailNoti,
        //当email失去焦点时再验证邮件格式，这时因为有的用户可能没用键盘输入邮箱，比如说paste
        focusout: emailNoti
    });
    //监听获取验证码的按钮．通知后端发送认证邮件．
    $('#container .getCaptcha').click(function(){
        $.post('/api/sendemail',{'email':$('#container .email').val()},function(res){
            //
        })
    });
};

//邮箱inpu的监听事件函数内容
var emailNoti = function(){
    let email = $("#container .email");
    let judge = /^.+@.+\.com$/.test(email.val());
    if(!judge){
        let notitation = $('<span class="emailNoti">你的邮箱格式不正确</span>');
        notitation.css({"position": "absolute","left": email.offset().left + email.width() + 25 + "px","top": email.offset().top + email.height()/3 + "px" ,"color": "red"});
        $("#container").append(notitation);
    }else{
        $('#container .emailNoti').text('');
    }
};

//存储了两套登录注册页的特效．每次加载页面随机用一套．cool
var randomBgStyle = function(){
    let number = Math.random()*10;
    //第一套背景特效：　下雪
    if(number>=5){
        $('#particle-js').css('background','#ddd');
        $('#container .sign').css('background','#aaa');
        $('#container .sign').hover(
            function(){
                $('#container .sign').css({'background':'black','color':'white'});
            },function(){
                $('#container .sign').css({'background':'#aaa','color':'black'});
            }
        )
        particlesJS.load('particle-js', '/javascripts/particles2.json', function() {
		    //成功加载particle设置信息
	    });
    }else{ //第二套：　粒子化
        $('#particle-js').css('background','#f7fafc');
        $('.sign').css('background','#bbb');
        $('#container .sign').hover(
            function(){
                $('#container .sign').css({'background':'black','color':'white'});
            },function(){
                $('#container .sign').css({'background':'#bbb','color':'black'});
            }
        )
        particlesJS.load('particle-js', '/javascripts/particles.json', function() {
		    //成功加载particle设置信息
	    });
    }
}
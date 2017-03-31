$(document).ready(function(){
    publicDoorListen();
    //动态设置particles　div的高为屏幕高度   
    $('#particle-js').css('height',$(window).height()+'px');

    //随机设置背景特效
    randomBgStyle();
    
});

//登录页的一些监听
let publicDoorListen = function(){
    $('#logInBtn').click(function(){
        $('#signUpBtn').css('color','grey');
        $('#logInBtn').css('color','black');
        $('#logInForm').css('display','flex');
        $('#signUpForm').css('display','none');
    });
    $('#signUpBtn').click(function(event){
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
    $('#container .getCaptcha').click(function(event){
        event.preventDefault();
        let notitation = $("<span class='emailNoti'></span>");
        //如果email格式不对的话．
        if(!judgeEmail($('#container .email').val())){
            notitation.empty().text('请输入正确的邮箱');
            $('#signUpForm > div').append(notitation);
            return;
        }
        let div = $('#signUpForm div').children();
        let obj = {
            "email": $(div[0]).val(),
            "username": $(div[1]).val(),
            "password": $(div[2]).val(),
            "password2": $(div[3]).val()
        };
        $.post('/api/sendemail',{'form': obj},function(res){
            if(res){ //如果有回复，那就是邮件发送成功的信息．
                notitation.empty().text('邮件已发送');
                $('#signUpForm > div').append(notitation);
            }
        })
    });

    $('#formSignUp').click(function(event){
        event.preventDefault();
        signupbtnClick();
    });
};

//邮箱inpu的监听事件函数内容
let emailNoti = function(){
    let email = $("#container .email");
    let judge = judgeEmail(email.val());
    if(!judge){
        let notitation = $('<span class="emailNoti">你的邮箱格式不正确</span>');
        notitation.css({"position": "absolute","left": email.offset().left + email.width() + 25 + "px","top": email.offset().top + email.height()/3 + "px" ,"color": "red"});
        $("#container").append(notitation);
    }else{
        $('#container .emailNoti').text('');
    }
};

//存储了两套登录注册页的特效．每次加载页面随机用一套．cool
let randomBgStyle = function(){
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
};

//注册按钮的点击
let signupbtnClick = function(){
    //如果邮箱提示span的有文本信息，那一定就是提示格式不正确的
    if($('#signUpForm .emailNoti').text().length > 5){
        $('#signUpForm .emailNoti').css('color','green');
        return;
    }
    //还有一些其他的判断，比如username有没有特殊字符，所有的input都填了没,实时判断email和username是不是已注册过．．．很简单但是没有趣味．不写了．．．反正是这个网站是自己写着玩的．傲娇.png
    let div = $('#signUpForm div').children();
    let obj = {
        "email": $(div[0]).val(),
        "username": $(div[1]).val(),
        "password": $(div[2]).val(),
        "password2": $(div[3]).val(),
        "captcha": $(div[4]).val()
    };
    $.post('/api/signup',{'form': obj},function(res){
        //
        window.location.href = '/';
    })
};

//验证邮箱格式是否正确
let judgeEmail = function(email){
    if(/^.+@.+\.com$/.test(email)){
        return true;
    }
    return false;
}
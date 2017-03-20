$(document).ready(function(){
    publicDoorListen();
    //动态设置particles　div的高为屏幕高度   
    $('#particle-js').css('height',$(window).height()+'px');

    //随机设置背景特效
    randomBgStyle();
    
});

//登录页的一些监听
var publicDoorListen = function(){
    console.log($(window).height()+'px');
    $('#signInBtn').click(function(){
        $('#signUpBtn').css('color','grey');
        $('#signInBtn').css('color','black');
        $('#signInForm').css('display','flex');
        $('#signUpForm').css('display','none');
    });
    $('#signUpBtn').click(function(){
        $('#signUpBtn').css('color','black');
        $('#signInBtn').css('color','grey');
        $('#signInForm').css('display','none');
        $('#signUpForm').css('display','flex');
    });
}

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
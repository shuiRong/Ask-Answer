$(document).ready(function(){
	listen();
});

function listen(){

	//监听提问按钮。 点击后显示提问窗口并且模糊化页面其它部分
	$('#askSpan').click(function(){
		$('#newDebateDialog').css('display','block');
		if(!document.getElementById('coverDiv')){
			var coverDiv = $('<div></div>');
			$(coverDiv).attr('id','coverDiv');
			$("body").append(coverDiv);
		}
		$('#coverDiv').css('display','block');
	});

	//监听提问框的取消和叉叉
	$('#ddCancelTwo').click(function(){
		cancel();
	});
	$('#ddCancelOne').click(function(){
		cancel();
	});
		
	//提问框的 提交按钮 的监听事件
	var username= unescape(unescape(getCookie('user')));
	$('#release').on('click',function(){
		let question = {'title':null,'description':null,'tags':null,'time':null,'questionProducer':null};
		question.questionProducer = username;
		question.title = $('#textareaOne').val();
		question.description = $('#textareaTwo').val();
		question.tags = $('#textareaThree').val();

		$.post('/api/newquestion',question,function(data){
			console.log('问题发送: ' + data);
		});
		cancel();
	});

	//导航栏用户名元素实现hover效果
	$('#signin').hover(function(){
		$('#signinHover').css('display','block');
	},function(){
		$('#signinHover').css('display','none');
	});

	//导航栏用户名下元素的hover效果
	//...

	//导航栏 退出的退出功能
	$('#signinHover > p:last-child').click(function(){
		//....
	});

	//导航栏 个人用户: 根据cookie的user改变a的href属性
	$('#userPageBtn').attr('href','/users/' + username);

}


//监听时 使用的方法
function cancel(){
	$('#newDebateDialog').css('display','none');
	$('#coverDiv').css('display','none');
};

//得到document的cookie里的 键对应的值;
function getCookie(key){
	let cookieString = document.cookie;
	let cookieArr = cookieString.split(';');
	let cookieObj = {}; 
	cookieArr.forEach(function(ele,index){
		let temp = ele.split('=');
		cookieObj[temp[0]] = temp[1];
	});
	return cookieObj[key];
}
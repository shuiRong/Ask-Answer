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
	var username= getCookie('user');
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

	//最热问题, 从数据库获取内容,动态添加.
	$('#popularBtn').click(function(){
		addPopQuestion();
	});
	//最新提问
	$('#newBtn').click(function(){
		addNew();
	});

}


//动态添加最热问题的数据到页面上.
function addPopQuestion(){
	$.post('/api/getquestion',{'arr': 'popular'},function(res){
		console.log(res.status);
		console.log(res.data);
		let contentGrid = $('#content-grid');
		data.forEach(function(ele){
			init();
			itemImage.attr('src',ele.image); //数据库里还没有
			itemTitle.attr('href',ele.questionLink);//数据库里还没有
			itemTitle.attr('target','_blank');
			itemTitle.text(ele.title);
			itemDes.text(ele.description);			
			questionProducer.text(ele.questionProducer);
			ele.tags.forEach(function(ele){
				itemTag = $('<span></span>');
				itemTag.text(ele);
				itemTags.append(itemTag);
			});
			
			liContent.append(itemTitle);
			liContent.append(itemDes);
			liContent.append(questionPruducer);
			liContent.append(itemTags);
			itemLi.append(itemImage);
			itemLi.append(liContent); 
		});

	});

	let init = function(){
		let itemLi = $('<li></li>');
		let itemImage = $('<img>');
		let liContent = $('<div></div>');
		let itemTitle = $('<a></a>');
		let itemDes = $('<p></p>');		
		let questionProducer = $('<span></span>');
		let itemTags = $('<span></span>');
		let liContent = $('#li-content');
	}
}

//动态添加最新问题数据到页面上;
function addNew(){
	$.post('/api/getquestion',{'arr': 'new'},function(res){
		console.lgo(res.status);
		console.log(res.data);
	});
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
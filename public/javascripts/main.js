window.onload = function(){
	listen();
}

function listen(){

	//监听提问按钮。 点击后显示提问窗口并且模糊化页面其它部分
	$('#askSpan').on('click',function(){
		$('#newDebateDialog').attr('style','display:block');
		var coverDiv = $('<div></div>');
		$(coverDiv).attr('id','coverDiv');
		$("body").append(coverDiv);
	});

	//监听提问框的取消和叉叉
	$('#ddCancelTwo').on('click',function(){
		cancel();
	});
	$('#ddCancelOne').on('click',function(){
		cancel();
	});

	//监听时 使用的方法
	function cancel(){
		$('#newDebateDialog').attr('style','display:none');
		$('#coverDiv').attr('style','display:none');
	};

	//提问框的 提交按钮 的监听事件
	$('#release').on('click',function(){
		var question = {'title':null,'description':null,'tags':null,'time':null,'whose':null};

		question.title = $('#textareaOne').val();
		question.description = $('#textareaTwo').val();
		question.tags = $('#textareaThree').val();

		/*question = JSON.stringify(question);*/
		console.log(question);

		$.post('/users',question,function(data){
			
		});
		cancel();
	});
}
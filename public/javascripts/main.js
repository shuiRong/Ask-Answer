$(document).ready(function(){
	listen();
});

function listen(){

	//监听提问按钮。 点击后显示提问窗口并且模糊化页面其它部分
	$('#askSpan').click(function(){
		$('#newDebateDialog').css('display','block');
		if(){
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

	//监听时 使用的方法
	function cancel(){
		$('#newDebateDialog').css('display','none');
		$('#coverDiv').css('display','none');
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
$(document).ready(function(){
    userPageListen();
    
});



function userPageListen(){
    //监听回答 button
    $('#uml-header span:first').click(function(){
        $('#umlm-quest').css('display','none');
        $('#umlm-ans').css('display','flex');
        renderData('answer',getCookie('user'));
    });
    //监听提问 button
    $('#uml-header  span:last-child').click(function(){
        $('#umlm-ans').css('display','none');
        $('#umlm-quest').css('display','flex');
        renderData('question',getCookie('user'));
    });
}



function renderData(arr,username){
    
    $.post('/api/getuser' + arr,{username: username},function(data){
        console.log('获取用户 提问or回答 数据: ' + data.status);
        
    });
}

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
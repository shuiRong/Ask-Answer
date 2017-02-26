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
    console.log('开始查询 提问数据');
    $.post('/api/getuser' + arr,{username: username},function(res){
        console.log('获取用户提问or回答数据状态: ' + res.status);
        console.log('data: ' + res.data);
        if(user==='question'){
            $('#mhlh-num2').text(res.data.length);

            let temp = $('<div></div>');
            let titleP = $('<p></p>');
            let spanTime = $('<span></span>');
            let tags = $('<span></span>');
            res.data.forEach(function(ele){


            })
            

        }else{

        }
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
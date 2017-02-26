$(document).ready(function(){    
    userPageListen();
    questionClicked();    
});

function userPageListen(){
    console.log('ads');
    //监听回答 button
    $('#umlh-num3').click(function(){
        answerClicked();
    });
    //监听提问 button
    $('#umlh-num1').click(function(){
        questionClicked();
    });
}

function questionClicked(){
    $('#umlm-ans').css('display','none');
    $('#umlm-quest').css('display','flex');
    $('#umlh-num1').css('font-weight','bold');
    $('#umlh-num3').css('font-weight','normal');
    if($('#umlm-quest').children().length===0){  //如果此元素子元素为0,就从服务区获取数据,并渲染
        renderData('question',getCookie('user'));
    }   
}

function answerClicked(){
    $('#umlm-quest').css('display','none');
    $('#umlm-ans').css('display','flex');
    $('#umlh-num3').css('font-weight','bold');
    $('#umlh-num1').css('font-weight','normal');
    renderData('answer',getCookie('user'));
}


function renderData(arr,username){
    console.log('开始查询 提问数据');
    $.post('/api/getuser' + arr,{username: username},function(res){
        console.log('获取用户提问or回答数据状态: ' + res.status);
        console.log('data: ' + res.data);
        if(arr==='question'){
            $('#mhlh-num2').text(res.data.length);
            //动态添加 DOM 元素
            res.data.forEach(function(ele){
                let item = $('<div class="item"></div>');
                let itemTitle = $('<p class="item-title"></p>');
                let itemTimeTags = $('<div class="item-time-tags"></div>');
                let itemTime = $('<span class="item-time"></span>');
                let itemTagsDiv = $('<div class="item-tags-div"></span>');
                let itemTag = $('<span class="item-tag"></span>');

                itemTitle.text(ele.title);
                time = ele.time.replace(/[T]/,' ').replace(/.{13}Z/,'');
                itemTime.text(time);
                ele.tags.forEach(function(ele){                    
                    itemTag.text(ele);
                    itemTagsDiv.append(itemTag);
                    itemTag = $('<span class="item-tag"></span>');                                
                });
                itemTimeTags.append(itemTime);
                itemTimeTags.append(itemTagsDiv);
                item.append(itemTitle);
                item.append(itemTimeTags);
                $('#umlm-quest').append(item);
            });            
        }else if(arr==='answer'){

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
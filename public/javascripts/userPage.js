$(document).ready(function(){    
    userPageListen();
    answerClicked();
    questionClicked();
});

function userPageListen(){
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
        console.log(res.status);
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
            let umlmAns = $('#umlm-ans');
            //改变回答的个数
            $('#umlh-num4').text(res.data.length);
            res.data.forEach(function(ele){
                let item = $('<div class="item"></div>');
                let itemTitle = $('<p class="item-title"></p>');
                let itemAnswer = $('<div class="item-answer"></div>');
                let itemTime = $('<span class="item-time"></span>');
                let itemComment = $('<span class="fa fa-comment item-comment">&nbsp;评论</span>');

                itemTitle.text(ele.title);
                itemAnswer.text(ele.content);
                itemTime.text(ele.time);

                item.append(itemTitle).append(itemAnswer).append(itemTime).append(itemComment);
                umlmAns.append(item);
            });
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
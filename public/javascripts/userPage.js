$(document).ready(function(){    
    userPageListen();
    //加载这个目的是为了显示回答旁边的数字,但这样做,请求了所有数据而没有用.不可取,但我懒的改了.嘿嘿.
    answerClicked();
    questionClicked();
    getUserInfo();
    
    //存储头像在服务器的路径．在页面加载时，更新此值
    var avatarServerPath = '';
});

//各种监听
function userPageListen(){

    //为上传图片的div增加hover样式．
    uploadImgHover();
    //预览用户选择的本地的图片．
    $('#upe-img .uploadImg').change(function(){
        previewImg();
    });
    //监听回答 button
    $('#umlh-num3').click(function(){
        answerClicked();
    });
    //监听提问 button
    $('#umlh-num1').click(function(){
        questionClicked();
    });
    //监听编辑个人资料按钮.
    $('#userEditBtn').click(function(){
        $('#userPageEdit').css('display','flex');
        $('#userHeader').css('display','none');
        $('#userMain').css('display','none');
        $('#upe-img').css('background-image','url('+ avatarServerPath +')');
        $('#upe-main > h1').text(unescape(unescape(getCookie('user'))));
    });
    // 编辑页的 X 按钮.把头像的url改回服务器的地址．
    //avatarServerPath 是全局变量，在页面加载时，更新此值．
    $('#upe-main .fa-close').click(function(){
        $('#userPageEdit').css('display','none');
        $('#userHeader').css('display','block');
        $('#userMain').css('display','flex');
        $('#uhs-img').css('background-image','url('+ avatarServerPath +')');
    });
    //监听个人编辑页的提交按钮.然后关掉编辑框.传递cookie里的用户名过去
    $('#upe-main .submit').click(function(){  
        let file = new FormData(document.getElementById('userPageEdit'));
        console.log(file,typeof(file));
        console.log($('#userPageEdit').serialize());
        $.ajax({
            url: '/api/useredit',
            type: 'POST',
            data: file,
            processData: false, //必须这么设置才能传FormData
            contentType: false,  //同上
            success: function(res){
                console.log(res.status);
            }
        });
        $('#userPageEdit').css('display','none');
        $('#userHeader').css('display','block');
        $('#userMain').css('display','flex');        
    });
}

var uploadImgHover = function(){
    $('#upe-img').hover(
        function(){            
            $('#upe-img-cover').css('display','flex');
        },function(){            
            $('#upe-img-cover').css('display','none');
    });
}

//用户上传图片本地预览.
//而且同时把个人主页的头像也给换成用户上传的．这样，用户提交表单后看到的就是上传的了．其实此时的头像并不是来自于服务器．hack．用户如果取消编辑．就把图片的地址换成服务器的．
var previewImg = function(){
    let file = $('#upe-img .uploadImg')[0].files[0];
    if(!/image\//.test(file.type)){
        alert('请选择图片！');
        return;
    }
    let render = new FileReader();
    render.readAsDataURL(file);
    let result = '';
    render.onload = function(e){
        result = e.target.result;
        $('#upe-img').css('background-image','url('+result+')');
        $('#uhs-img').css('background-image','url('+result+')');
    }
}

function questionClicked(){
    $('#umlm-ans').css('display','none');
    $('#umlm-quest').css('display','flex');
    $('#umlh-num1').css('font-weight','bold');
    $('#umlh-num3').css('font-weight','normal');
    if($('#umlm-quest').children().length===0){  //如果此元素子元素为0,就从服务区获取数据,并渲染
        renderData('question');
    }
}

function answerClicked(){
    $('#umlm-quest').css('display','none');
    $('#umlm-ans').css('display','flex');
    $('#umlh-num3').css('font-weight','bold');
    $('#umlh-num1').css('font-weight','normal');
    renderData('answer');
}

// 页面加载时获取用户个人信息
function getUserInfo(){
    $.get('/api/getuserinfo',function(res){
        let data = res.data;
        //更新用户名
        let username = $('<span></span>');
        username.text(data.username);
        let uhsRight = $('#uhs-right');
        uhsRight.append(username);
        //更新用户的标签
        data.tags.forEach(function(ele){
            let tag = $('<span class="uhs-tags"></span>');
            tag.text(ele);
            uhsRight.append(tag);
        });
        //更新用户的个性签名
        let motto = $('<p></p>');
        motto.text(data.description);
        uhsRight.append(motto);
        //更新用户头像的src为服务器地址．
        avatarServerPath = data.avatar;
        $('#uhs-img').css('background-image','url(' + avatarServerPath + ')');
    });
}

function renderData(arr){
    console.log('开始查询 提问数据');
    $.get('/api/getuser' + arr,function(res){
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
            //在页面加载时已经加载过一次这个.所以先把div清空下
            let umlmAns = $('#umlm-ans').empty();
            console.log(umlmAns.children().length);
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
                console.log(item);
                umlmAns.append(item);
                console.log(umlmAns.children().length);
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
$(document).ready(function(){
    questionPageListen();
    listAnswers();
    
});

function questionPageListen(){
    //监听 发布答案按钮.
    $('#qpm-down .submit').click(function(){
        let questionID = getQuestionID();
        // getCookie 函数在main.js里,这里可以调用的到
        let user = getCookie('user');
        let answer = $('textarea').val();
        $.post('/api/newanswer',{
                question: questionID,
                questionTitle: $('#qpm-up .title').text(),
                user: user,
                answer: answer},function(res){
                    console.log(res.status);
                });
        $('textarea').val('');
    });
    
};

function getQuestionID(){
    let href = window.location.href;
    let questionID = href.replace(/.*question\//,'');
    return questionID;
}

//从后获取问题答案数据,然后动态加载. 同时根据答案里是否有此用户的回答来决定是否显示回答框
function listAnswers(){
    let questionID = getQuestionID();
    $.post('/api/getanswers',{username: getCookie('user'),questionID: questionID},function(res){
        //修改页面回答数量
        $('#qpm-up-answer-count span:first-child').text(res.data.length + '个回答');
        dealTimeFormat(res.data);            
        dynamicAddAnswer(res.data);
    });
}

//动态生成DOM元素
function dynamicAddAnswer(data){    
    let qpmMid = $('#qpm-mid');
    data.forEach(function(ele){
        let answerDiv = $('<div class="answerDiv"></div>');
        let judge = $('<div class="judge"></div>');
        let up = $('<span class="up fa fa-sort-up fa-2x" onclick="upScore(this)"></span>');
        let score = $('<span class="score">0</span>');
        let down = $('<span class="down fa fa-sort-down fa-2x" onclick="downScore(this)"></span>');
        judge.append(up).append(score).append(down);
        let answerName = $('<span class="answerName"></span>');
        let answerMotto = $('<span class="answerMotto"></span>');
        let answerImg = $('<img class="answerImg" src="/images/3.jpg">');
        let answerText = $('<div class="answerText"></div>');
        //如果这个回答是cookie里的这个人的,那么这个答案就填家修改按钮.
        let answerModify = null;
        if(getCookie('user')==ele.answerProducer){   //如果有此用户的回答
            answerModify = $('<span class="fa fa-pencil" onclick="ansModify(this)"> 修改</span>');
            //把修改按钮消失掉
            $('#qpm-down').css('display','none');        
        }
        let p = $('<p></p>');
        let answerTime = $('<span class="answerTime"></span>');
        let comment = $('<span class="fa fa-comment">&nbsp;评论</span>');

        answerDiv.attr('id',ele._id);  //存储答案的_id,更新答案时用
        answerTime.text('发布于 ' + ele.time);
        answerText.text(ele.answerContent);
        answerMotto.text('需要从数据库里获取');
        answerName.text(unescape(unescape(ele.answerProducer)));

        p.append(answerTime).append(comment);
        if(answerModify){  
            answerText.append(answerModify);
        }
        answerDiv.append(judge).append(answerName).append(answerMotto).append(answerImg).append(answerText).append(p);
        qpmMid.append(answerDiv);
    }); 
}

//监听回答后的修改按钮
var ansModify = function(which){
        let parentEle = which.parentElement;
        let answer = parentEle.firstChild;       
        let textarea = $('<textarea class="textarea"></textarea>');
        textarea.html(answer);
        let div = $('<div></div>');
        let cancel = $('<span class="cancel" onclick="answerTextCancel(this)">取消</span>');
        let submit = $('<span class="submit" onclick="answerTextSubmit(this)">发布</span>');
        div.append(cancel).append(submit);
        $(parentEle).append(textarea).append(div);
        //把修改按钮消失掉
        $(which).css('display','none');
    
};

//监听回答的点赞.
var upScore = function(which){
    let answerID = $(which.parentElement.parentElement).attr('id');
    //和反对共用一个api, 点赞的话,arr就是数字1,反对就是数字-1.
    $.post('/api/changescore',{'answerID': answerID,'arr': 1},function(res){
        console.log(res.status);
    });
};
//监听回答的反对.
var downScore = function(which){    
    let answerID = $(which.parentElement.parentElement).attr('id');
    $.post('/api/changescore',{'answerID': answerID,'arr': -1},function(res){
        console.log(res.status);
    });
}; 


// 回答修改框的 取消按钮
function answerTextCancel(which){
    //这个回答块的最高父元素
    let answerText = $(which.parentElement.parentElement);
    let answer = answerText.children('textarea').text();
    answerText.empty().prepend(answer);
    let span = $('<span class="fa fa-pencil" onclick="ansModify(this)">修改</span>');
    answerText.append(span);
}
// 回答的修改框 的发布按钮.更新用户回答.
function answerTextSubmit(which){
    let answerText = $(which.parentElement.parentElement);
    let answer = answerText.children('textarea').val();
    //更新的回答提交到后端接口.
    $.post('/api/updateanswer',{username: getCookie('user'),answer: answer,answerID: $('#qpm-mid .answerDiv').attr('id')},function(res){
    });
    //同时,把更新的内容,写到页面里. 如果刷新的话,这个回答就是从服务端获得的了. 
    //本来还想着要不要提交更新后刷新页面,现在还是如今的方法666.
    answerText.empty().prepend(answer);
    let span = $('<span class="fa fa-pencil" onclick="ansModify(this)">修改</span>');
    answerText.append(span);
}

//按回答时间的倒序排列: 最新的在最上面
function sortByTime(data){      
    /*data.sort(function(a,b){    
        return a.time - b.time;
    });*/
}

//回答按时间正序排列
/*function sortByTimeReverse(data){
    return data.reverse();
}*/

//处理 数据里时间的格式.变成 2017-2-29 23:13 
function dealTimeFormat(data){
    data.forEach(function(ele){
        ele.time = ele.time.replace(/[T]/,' ').replace(/.{7}Z/,'');
    });
}
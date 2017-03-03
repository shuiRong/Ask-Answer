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

//从后获取问题答案数据,然后动态加载.
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
    console.log(data);
    let qpmMid = $('#qpm-mid');
    data.forEach(function(ele){
        let questionDiv = $('<div class="questionDiv"></div>');
        let answerName = $('<span class="answerName"></span>');
        let answerMotto = $('<span class="answerMotto"></span>');
        let answerImg = $('<a class="answerImg"></a>');
        let answerText = $('<p class="answerText"></p>');
        let p = $('<p></p>');
        let answerTime = $('<span class="answerTime"></span>');
        let comment = $('<span class="fa fa-comment">&nbsp;评论</span>');
        
        answerTime.text('发布于 ' + ele.time);
        answerText.text(ele.answerContent);
        answerMotto.text('需要从数据库里获取');
        answerName.text(unescape(unescape(ele.answerProducer)));

        p.append(answerTime).append(comment);
        questionDiv.append(answerName).append(answerMotto).append(answerImg).append(answerText).append(p);
        qpmMid.append(questionDiv);
    });
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
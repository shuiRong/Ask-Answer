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
        let judge = $('<div class="judge" score="0" finalScore="0"></div>');
        let up = $('<span class="up fa fa-sort-up fa-2x" clicked="0" onclick="upVote(this)"></span>');
        let score = $('<span class="score">0</span>');
        let down = $('<span class="down fa fa-sort-down fa-2x" clicked="0" onclick="downVote(this)"></span>');

        judge.attr('score',ele.weight).attr('finalScore',ele.weight);
        score.text(ele.weight);
        judge.append(up).append(score).append(down);
        
        //检测cookie里的用户在不在此答案的voter里,如果在的话,对应的up/down的clicked变成1,即点击奇数次,然后样式变变.
        ele.voter.forEach(function(ele){
            if(ele[0] == getCookie('user')){  //此用户点过赞同或反对
                if(ele[1] == 1){ // 点的是赞同
                    up.attr('clicked','1');
                    up.css({'color':'black','font-size':'3em'});
                }else{  //反对
                    down.attr('clicked','1');
                    down.css({'color':'black','font-size':'3em'});
                }
            }
        });

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

//给.judge元素设置score属性记录当前回答的赞数.用户点击时的计算结果保存给它,而属性serverScore永远保存的是数据库里当前回答的赞数.所以需要给这两个属性初始化.
//监听回答的点赞.
var upVote = function(which){
    let serverScore = $(which.parentElement).attr('finalScore');  //从服务器端获取的某答案的score;
    //父元素的 socre属性记录答案赞数.每次页面加载时从服务端获取.
    let score;
    if($(which.parentElement.children[2]).attr('clicked')==1){
        $(which.parentElement).attr('score',serverScore);
        score = serverScore;
    }else{
        score = $(which.parentElement).attr('score');
    }
    let clicked = $(which).attr('clicked');  //是否被点过,0表示没点过,1表示奇数次,2偶数次    
    switch (clicked){
        case '0':
            score = Number(score)+1;
            $(which.parentElement).attr('score',score);
            $(which).attr('clicked','1').css({'color': 'black','font-size': '3em'});
            $(which.parentElement.children[2]).attr('clicked','0').css({'color': 'grey','font-size': '2em'});
            break;
        case '1':
            score = Number(score) - 1;
            $(which.parentElement).attr('score',score);
            $(which).attr('clicked','2').css({'color': 'grey','font-size': '2em'});
            break;
        case '2':
            score = Number(score) + 1;
            $(which.parentElement).attr('score',score);
            $(which).attr('clicked','1').css({'color': 'black','font-size': '2em'});
            break;
    }        
    //改变中间的分数
    score = $(which.parentElement).attr('score');
    $(which.parentElement.children[1]).text(score);
    let answerID = $(which.parentElement.parentElement).attr('id');
    let user = getCookie('user');
    /*
        'voter':[user,1,1]   记录点赞或反对的用户.第二个参数表示用户点的是up/down,第三个参数表示用户点击up/down的次数.
    */
    let clicks = $(which).attr('clicked');
    $.post('/api/changescore',{'answerID': answerID,'arr': score,'voter':[user,1,clicks]},function(res){
        //接口没有返回信息
    });
};


//监听回答的反对.
var downVote = function(which){
    let serverScore = $(which.parentElement).attr('finalScore');  //从服务器端获取的某答案的score;
     //父元素的 socre属性记录答案的赞数.
    let score;
    if($(which.parentElement.children[0]).attr('clicked')==1){
        $(which.parentElement).attr('score',serverScore);
        score = serverScore;
    }else{
        score = $(which.parentElement).attr('score');
    }
    let clicked = $(which).attr('clicked');  //是否被点过,0表示没点过,1表示奇数次,2偶数次
    
    switch (clicked){
        case '0':
            score = Number(score) - 1;
            $(which.parentElement).attr('score',score);
            $(which).attr('clicked','1').css({'color': 'black','font-size': '3em'});
            $(which.parentElement.children[0]).attr('clicked','0').css({'color': 'grey','font-size': '2em'});
            break;
        case '1':
            score = Number(score) + 1;
            $(which.parentElement).attr('score',score);
            $(which).attr('clicked','2').css({'color': 'grey','font-size': '2em'});  
            break;
        case '2':
            score = Number(score) - 1;
            $(which.parentElement).attr('score',score);
            $(which).attr('clicked','1').css({'color': 'black','font-size': '2em'});  
            break;
    }    
    score = $(which.parentElement).attr('score');
    //改变中间的分数
    $(which.parentElement.children[1]).text(score);
    let user = getCookie('user');
    let clicks = $(which).attr('clicked');   //这条语句的注释看在upVoter()里
    let answerID = $(which.parentElement.parentElement).attr('id');
    $.post('/api/changescore',{'answerID': answerID,'arr': score,'voter':[user,0,clicks]},function(res){
        //接口没有返回信息
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
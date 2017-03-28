$(document).ready(function(){
    questionPageListen();
    listAnswers();
    //运行highlight.js    
});

function questionPageListen(){
    //监听 发布答案按钮.
    $('#qpm-down .submit').click(function(){
        let questionID = getQuestionID();
        let answer = $('textarea').val();
        $.post('/api/newanswer',{
                question: questionID,
                questionTitle: $('#qpm-up .title').text(),
                answer: answer},function(res){
                    // console.log(res.status);
                });
        $('#newAnswer').val('').css('display','none');
        location.reload(false);
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
    $.post('/api/getanswers',{questionID: questionID},function(res){
        //修改页面回答数量
        $('#qpm-up-answer-count span:first-child').text(res.data.length + '个回答');
        dealTimeFormat(res.data);
        let data = sortByScore(res.data);
        dynamicAddAnswer(res.data,res.user);

    });
}

//动态生成DOM元素
function dynamicAddAnswer(data,username){
    let qpmMid = $('#qpm-mid');
    data.forEach(function(ele){
        let answerDiv = $('<div class="answerDiv"></div>');
        let answerMD = $('<div class="answerMD"></div>');
        answerMD.text(ele.answerContent);
        
        let judge = $('<div class="judge" score="0" finalScore="0"></div>');
        let up = $('<span class="up fa fa-sort-up fa-2x" clicked="0" onclick="upVote(this)"></span>');
        let score = $('<span class="score">0</span>');
        let down = $('<span class="down fa fa-sort-down fa-2x" clicked="0" onclick="downVote(this)"></span>');

        judge.attr('score',ele.weight).attr('finalScore',ele.weight);
        score.text(ele.weight);
        judge.append(up).append(score).append(down);
        
        //检测cookie里的用户在不在此答案的voter里,如果在的话,对应的up/down的clicked变成1,即点击奇数次,然后样式变变.
        ele.voter.forEach(function(ele){
            if(ele[0] == username){  //此用户点过赞同或反对
                if(ele[1] == '1'　&& ele[2]== '1'){ // 点的是赞同并且点了奇数次
                    up.attr('clicked','1');
                    up.css({'color':'black','font-size':'3em'});
                }else if(ele[2] == '1'){  //反对并奇数次
                    down.attr('clicked','1');
                    down.css({'color':'black','font-size':'3em'});
                }
            }
        });

        let answerName = $('<span class="answerName"></span>');
        let answerMotto = $('<span class="answerMotto"></span>');
        let answerImg = $('<img class="answerImg" src="/images/avatar.jpg">');
        let answerText = $('<div class="answerText"></div>');
        //如果这个回答是cookie里的这个人的,那么这个答案就填加修改按钮.
        let answerModify = null;
        if(username==ele.answerProducer){   //如果有此用户的回答
            answerModify = $('<span class="fa fa-pencil" onclick="ansModify(this)">&nbsp;修改</span>');
            //把修改按钮消失掉
            $('#qpm-down').css('display','none');        
        }
        let p = $('<p></p>');
        let answerTime = $('<span class="answerTime"></span>');
        let comment = $('<span class="fa fa-comment">&nbsp;评论</span>');

        answerDiv.attr('id',ele._id);  //存储答案的_id,更新答案时用
        answerTime.text('发布于 ' + ele.time);
        answerImg.attr('src',ele.avatar);
        //对markdown文本进行xss转义
        answerText.html(marked(xssFilters.inHTMLData(ele.answerContent)));
        answerMotto.text('需要从数据库里获取');
        answerName.text(unescape(unescape(ele.answerProducer)));

        p.append(answerTime).append(comment);
        if(answerModify){  
            answerText.append(answerModify);
        }
        answerDiv.append(judge).append(answerName).append(answerMotto).append(answerImg).append(answerMD).append(answerText).append(p);
        qpmMid.append(answerDiv);
    }); 
    $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
}

//监听回答后的修改按钮
var ansModify = function(which){
        let superParentEle = which.parentElement.parentElement;
        let answerMD = $(superParentEle).children('.answerMD').text();
        //如果用户第一次点击修改按钮的话，生成textarea，以后只用改变display        
        if($(superParentEle).children('.textarea').length==0){            
            let textarea = $('<textarea class="textarea"></textarea>');
            //对markdown文本进行xss转义
            textarea.val(xssFilters.inHTMLData(answerMD));
            $(superParentEle).append(textarea);
        }else{
            $(superParentEle).children('.textarea').css('display','block');
        }
        
        //取消发布div.如果没有此div也就是用户第一次点修改
        if($(superParentEle).children('.cancelSubmit').length==0){
            let div = $('<div class="cancelSubmit"></div>');
            let cancel = $('<span class="cancel" onclick="answerTextCancel(this)">取消</span>');
            let submit = $('<span class="submit" onclick="answerTextSubmit(this)">发布</span>');
            div.append(cancel).append(submit);
            $(superParentEle).append(div);
        }else{
            $(superParentEle).children('.cancelSubmit').css('display','block');
        }
        //回答div消失掉
        $(which.parentElement).css('display','none');
        //回答下面的时间评论p消失掉
        $(superParentEle).children('p').css('display','none');
    
};

// 回答修改框的 取消按钮
function answerTextCancel(which){
    //这个回答块的最高父元素
    let superParent = $(which.parentElement.parentElement);
    //显示回答div和最下面的评论时间p
    superParent.children('p').css('display','block');
    superParent.children('.answerText').css('display','block');
    superParent.children('textarea').css('display','none'); 
    superParent.children('.cancelSubmit').css('display','none');
   /* let span = $('<span class="fa fa-pencil" onclick="ansModify(this)">&nbsp;修改</span>');
    superParent.append(span);*/
}
// 回答的修改框 的发布按钮.更新用户回答.
function answerTextSubmit(which){
    let superParent = $(which.parentElement.parentElement);
    let answer = superParent.children('.textarea').val();
    console.log(answer);
    //先把新的回答更新到answerMD
    superParent.children('.answerMD').text(answer);
    superParent.children('.answerText').html(marked(answer));
    //再更新的回答提交到后端接口.
    $.post('/api/updateanswer',{answer: answer,answerID: superParent.attr('id')},function(res){
    });

    //重新生成回答修改按钮
    let answerModify = $('<span class="fa fa-pencil" onclick="ansModify(this)">&nbsp;修改</span>');
    let answerText = superParent.children('.answerText');
    answerText.append(answerModify);

    superParent.children('p').css('display','block');
    answerText.css('display','block');
    superParent.children('textarea').css('display','none'); 
    superParent.children('.cancelSubmit').css('display','none');


}


//监听回答的点赞.

//给.judge元素设置score属性记录当前回答的赞数.用户点击时的计算结果保存给它,而属性serverScore永远保存的是数据库里当前回答的赞数.所以需要给这两个属性初始化.
//点赞/反对的思路是: 定义几个元素属性,之所以不用变量是因为这个东西需要和回答绑定起来,变量的话,做不到吧.好吧其实可以做到,但是麻烦.所以直接用div的attr了当成变量存储信息了.
//这几个属性记录用户点的是up还是down.up/down点了奇数此还是偶数次,还有记录从服务器获得的分数.
//在前端计算回答的分数.
var upVote = function(which){
    let serverScore = $(which.parentElement).attr('finalScore');  //从服务器端获取的某答案的score;
    let parent = $(which.parentElement);
    let score = parent.attr('score');
    let clicked = $(which).attr('clicked');  //是否被点过,0表示没点过,1表示奇数次,2偶数次    
    let downVote = $(parent.children()[2]);
    //如果是从点过downVote 奇数次，然后点upVote的．
    if(downVote.attr('clicked')=='1'){
        downVote.attr('clicked','0').css({'color':'grey','font-size':'2em'});
        $(which).attr('clicked','1').css({'color':'black','font-size':'3em'});
        score = Number(score) + 2;
    }else{
        switch(clicked){
            case '0':
                score = Number(score)+1;
                $(which).attr('clicked','1').css({'color':'black','font-size':'3em'});
                break;
            case '1':
                score = Number(score) - 1;
                $(which).attr('clicked','2').css({'color':'grey','font-size':'2em'});
                break;
            case '2':
                score = Number(score) + 1;
                $(which).attr('clicked','1').css({'color':'black','font-size':'3em'});
                break;
        }
    }
    $(which.parentElement).attr('score',score);
    //改变中间的分数    
    $(which.parentElement.children[1]).text(score);
    let answerID = $(which.parentElement.parentElement).attr('id');
    let user = ''; //这个user是空值,后端会换成session里的username
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
    let serverScore = $(which.parentElement).attr('finalScore');
    let parent = $(which.parentElement);
    let score = parent.attr('score');
    let clicked = $(which).attr('clicked');  //是否被点过,0表示没点过,1表示奇数次,2偶数次
    let upVote = $(parent.children()[0]);
    if(upVote.attr('clicked')=='1'){
        upVote.attr('clicked','0').css({'color':'grey','font-size':'2em'});
        $(which).attr('clicked','1').css({'color':'black','font-size':'3em'});        
        score = Number(score) - 2;        
    }else{
        switch(clicked){
            case '0':
                score = Number(score) - 1;
                $(which).attr('clicked','1').css({'color':'black','font-size':'3em'});
                break;
            case '1':
                score = Number(score) + 1;
                $(which).attr('clicked','2').css({'color':'grey','font-size':'2em'});
                break;
            case '2':
                score = Number(score) - 1;
                $(which).attr('clicked','1').css({'color':'black','font-size':'3em'});
                break;
        }
    }
    $(which.parentElement).attr('score',score);
    //改变中间的分数
    $(which.parentElement.children[1]).text(score);
    //这个user不会被后端信任,后端从session里取user
    let user = '';
    let clicks = $(which).attr('clicked');   //这条语句的注释看在upVoter()里
    let answerID = $(which.parentElement.parentElement).attr('id');
    $.post('/api/changescore',{'answerID': answerID,'arr': score,'voter':[user,0,clicks]},function(res){
        //接口没有返回信息
    });
}; 




//按回答时间的倒序排列: 最新的在最上面
/*function sortByTime(data){      
    data.sort(function(a,b){    
        return a.time - b.time;
    });
}*/

//根据回答的赞数正序排序.
function sortByScore(data){
    return data.sort(function(a,b){
        return b.weight - a.weight;
    });
}

//处理 数据里时间的格式.变成 2017-2-29 23:13 
function dealTimeFormat(data){
    data.forEach(function(ele){
        ele.time = ele.time.replace(/[T]/,' ').replace(/.{7}Z/,'');
    });
}
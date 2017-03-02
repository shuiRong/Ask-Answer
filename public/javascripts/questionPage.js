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
        console.log(res.status);
       // let data = sortByTime(dealTimeFormat(res.data));
        console.log(typeof(res.data));
    });    
}

//通过回答的权重排列

//按回答时间的倒序排列: 最新的在最上面
function sortByTime(data){  
    console.log(typeof(data));
    /*return data.sort(function(a,b){
        console.log(a);
        return a.time - b.time;
    });*/
}

//回答按时间正序排列
function sortByTimeReverse(data){
    return data.reverse();
}

//处理 数据里时间的格式.变成 2017-2-29 23:13 
function dealTimeFormat(data){
    data.forEach(function(ele){
        ele.time = ele.time.replace(/[T]/,' ').replace(/.{13}Z/,'');
    });
}
$(document).ready(function(){
    questionPageListen();
    listAnswers();
    listQuestions();
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

function listQuestions(){
    /*$.post('/api/',function(res){
        
    });*/
}


function getQuestionID(){
    let href = window.location.href;
    let questionID = href.replace(/.*question\//,'');
    return questionID;
}

//从后获取问题答案数据,然后动态加载.
function listAnswers(){
    let questionID = getQuestionID();
    $.post('/api/getanswers',{username: getCookie('user'),questionID: questionID},function(res){
        console.log(res);
    });
    console.log('请求回答数据成功!');
}
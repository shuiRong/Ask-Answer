$(document).ready(function(){
    questionPageListen()
});

function questionPageListen(){
    //监听 发布答案按钮.
    $('#qpm-down .submit').click(function(){
        let href = window.location.href;
        let questionID = href.replace(/.*question\//,'');
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
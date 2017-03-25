var express = require('express');
var router = express.Router();
require('../../database/connect');
var Question = require('../../database/question');
var Answer = require('../../database/answer');


//问题主页, 动态获取回答.排序部分还是在前端做吧.
router.route('/')
    .post(function(req,res){
        let questionID = req.body.questionID;
        var answers = []; //存储问题的回答数组.元素为 _id 值
        Question.findOne({'_id': questionID},'answers',function(err,doc){
            if(err){
                console.error('=== find error: ',err);
            }else{
                answers = doc.answers;
                //异步获取问题的回答从答案的collection里
                let length = answers.length;
                let count = 0; //记数器,控制异步何时结束.
                let data = [];
                let status = ''; //记录查询状态;                
                answers.forEach(function(ele){                
                    Answer.findOne({'_id': ele},function(err,doc2){
                        if(err){
                            console.error('=== find error: ',err);
                            status = '服务端查询问题答案数据,出错!';
                        }else{
                            data.push(doc2);
                            count++;
                            if(count == length){
                                status = '获取问题回答数据,成功!';                    
                                //把当前用户的user发送到前端使用,而不是用cookie里的user
                                res.send({status: status,data: data,user: req.session.user});
                            }
                        }
                    });
                });
            }
        });
    });

module.exports = router;
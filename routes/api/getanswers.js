var express = require('express');
var router = express.Router();
require('../../database/connect');
var Question = require('../../database/question');
var Answer = require('../../database/answer');

router.route('/')
    .post(function(req,res){
        let username = req.body.username;
        let questionID = req.body.questionID;
        var answers = []; //存储问题的回答数组.元素为 _id 值
        Question.findOne({'_id': questionID},'answers',function(err,doc){
            if(err){
                console.error('=== find error: ',err);
            }else{
                console.log('--- doc :' ,doc);
                answers = [].concat(doc);
                //异步获取问题的回答从答案的collection里
                let length = answers.length;
                let count = 0; //记数器,控制异步何时结束.
                let data = [];
                let status = ''; //记录查询状态;
                console.log('--- answer type:' ,Array.isArray(answers),"|",answers);
                answers.forEach(function(ele){                
                    Answer.findOne({'_id': answers[0]},function(err,doc2){
                        if(err){
                            console.error('=== find error: ',err);
                            status = '服务端查询问题答案数据,出错!';
                        }else{                            
                            data.push(doc2);
                            count++;
                            if(count == length){
                                status = '获取问题回答数据,成功!';
                                res.send({status: status,data: data});
                            }
                           
                        }
                    });
                });
            }
        });            

    });

module.exports = router;
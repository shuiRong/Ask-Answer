var express = require('express');
var router = express.Router();
var async = require('async');
require('../../database/connect');
var Question = require('../../database/question');
var Answer = require('../../database/answer');
var User = require('../../database/user');


//问题主页, 动态获取回答.排序部分还是在前端做吧.
router.route('/')
    .post(function(req,res){
        let questionID = req.body.questionID;
        
        async.waterfall([
            function(callback){
                Question.findOne({'_id': questionID}, 'answers',function(err,doc){
                    err ? callback(err) : callback(null,doc.answers);
                });
            },//根据问题_id数组,异步并行获取对应的回答数据.
            function(result,callback){
                async.map(result,function(item,callback){
                    Answer.findOne({'_id': item},function(err,doc2){
                        err ? callback(err) : callback(null,doc2);
                    });
                },function(err,results){
                    err ? callback(err) : callback(null,results);
                });
            },//把答案数据里的avatar字段,全更新成用户数据里的.
            function(result,callback){
                async.each(result,function(item,callback){
                    User.findOne({'username': unescape(unescape(item.answerProducer))},'avatar',function(err,doc3){
                        err ? callback(err) : item.avatar = doc3.avatar,callback();
                    });
                },function(err){
                    err ? callback(err) : callback(null,result);
                });
            },
            function(result,callback){
                res.send({status: '获取问题答案数据成功',data: result,user: req.session.user});
                callback(null,result);
            }
        ],function(err,result){
            err ? console.error('=== getanswer.js 出错: ',err) : console.log('问题回答数据发送成功!');
        })

/*        Question.findOne({'_id': questionID},'answers',function(err,doc){
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
        });*/
    });

module.exports = router;
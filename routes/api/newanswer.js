var express = require('express');
var router = express.Router();
require('../../database/connect');
var Question = require('../../database/question');
var Answer = require('../../database/answer');
var moment = require('moment');

router.route('/')
    .post(function(req,res){       
        let ansObj = req.body;
        let answer = new Answer({
            answerProducer: ansObj.user,
            answerContent: ansObj.answer,
            time: new moment().format()
        });        
        //记录回答存储状态
        let satus = '';
        answer.save(function(err,doc){
            if(err){
                console.error('=== 答案存储出错',err);
                status = '回答存储失败!';
                res.send({status: status});
            }else{                
                let answerID = doc['_id'];
                //把问题的answers数组取出来.
                let answers = [];
                Question.findOne({'_id': ansObj.question},'answers',function(err,doc2){
                    if(err){
                        console.error('=== find error',err);
                    }else{
                        answers = doc2.answers;
                    }
                });                
                //把新的回答合并到之前的回答数组里,然后更新问题.
                answers.push(answerID);
                Question.update({'_id': ansObj.question},{$set:{'answers': answers}},function(err,doc3){
                    if(err){
                        console.error('=== find error',err);
                        status = '回答存储失败!';
                        res.send({status: status});
                    }else{
                        console.log('<<< 存储新的回答,成功!');
                        status = '回答存储成功!'
                        res.send({status: status});
                    }
                });
            }
        });
    });

module.exports = router;

var express = require('express');
var router = express.Router();
require('../../database/connect');
var Question = require('../../database/question');
var Answer = require('../../database/answer');
var moment = require('moment');

router.route('/')
    .post(function(req,res){
        console.log('req.body: ',req.body);
        let ansObj = req.body;
        let answer = new Answer({
            answerProducer: ansObj.user,
            answerContent: ansObj.answer,
            time: moment.format()
        });
        answer.save(function(err,doc){
            if(err){
                console.error('=== 答案存储出错',err);
            }else{
                let answerID = doc['_id'];
                
            }
        });
    });

module.exports = router;

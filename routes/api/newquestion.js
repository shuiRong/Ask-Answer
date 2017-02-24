var express = require('express');
var router = express.Router();
//引入时间模块,更本土化的处理方式.
var moment = require('moment');
require('../../database/connect');
var Question = require('../../database/question');

//监听  /api/newquest   把用户提交的问题存起来
router.route('/')
    .post(function(req,res){
        //再次处理下
        let quest = req.body;
        quest.time = new moment().format(); //加入问题提交的时间  2017-02-24T19:31:42+08:00
        quest.time = new moment().format().replace(/\+.*/,''); 
        quest.tags = quest.tags.split(/[,，; ]/);
        
        let question = new Question({
            title: quest.title,
            description: quest.description,
            tags: quest.tags,
            time: quest.time,
            questionProducer: quest.questionProducer,
        })
        question.save(function(err,doc){
            if(err){
                console.error('Question save error!' + err);
            }else{
                console.info('Questoin save success!' + doc);
            }
        });        
        res.send('问题提交成功!');
    })





module.exports = router;
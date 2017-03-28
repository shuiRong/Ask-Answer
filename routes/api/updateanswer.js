var express = require('express');
var router = express.Router();
var Answer = require('../../database/answer');
var moment = require('moment');
var xssFilters = require('xss-filters');

//更新用户答案  ::时间方面出了问题,数据库里的,取出来展示出来的 console的有时不一样.shit.
router.route('/')
    .post(function(req,res){
        let data = req.body;
        let time = new moment().format();
        Answer.update({'_id': data.answerID},{$set:{'answerContent': xssFilters.inHTMLData(data.answer),'time': time}},function(err,doc){
           if(err){
               console.error('=== update error', err);
           }else{
               res.send({status: '更新答案,成功!'});
           }
        });
    });

module.exports = router;
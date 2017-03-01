var express = require('express');
var router = express.Router();
require('../database/connect');
var Question = require('../database/question');

//问题主页 把特定问题和问题答案数据取出,在后端渲染好.
router.route('/')
    .get(function(req,res){                
        let questionID = req.originalUrl.replace(/\/.*\//,'');
        
        Question.findOne({'_id': questionID},function(err,doc){
            if(err){
                console.error('=== find question error: ',err);
            }else{
                console.log('<<< 问题主页查询特定问题,成功!');
                res.render('questionPage',doc);
            }
        });

        
    });


module.exports = router;
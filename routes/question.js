var express = require('express');
var router = express.Router();
require('../database/connect');
var Question = require('../database/question');

//问题主页 把特定问题数据取出,在后端渲染好.回答的话,前端动态获取吧.
router.route('/')
    .get(function(req,res){
        //如果未登录
        if(!req.session.isAuthed){
            res.redirect('/');
        }else{
            let questionID = req.originalUrl.replace(/\/.*\//,'');
            Question.findOne({'_id': questionID},function(err,doc){
                if(err){
                    console.error('=== find question error: ',err);
                }else{                     
                    res.render('questionPage',{
                                data: doc
                            });
                }
            });
        }

        
    });


module.exports = router;
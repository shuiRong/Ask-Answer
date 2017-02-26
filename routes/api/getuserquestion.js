var express = require('express');
var router = express.Router();
require('../../database/connect');
var Question = require('../../database/question');
var User = require('../../database/user');

//监听  /api/getuserquestion
router.route('/')
    .post(function(req,res){
        
        let user = unescape(unescape(req.body.username));
        let data = [];
        User.findOne({'username': user},'askQuestions',function(err,doc){
            if(err){
                console.error('=== find error: ' + err);
            }else{            
                let questionIds = doc['askQuestions'];  
                let length = questionIds.length;
                let count = 0;
                //操作是异步的! 
                questionIds.forEach(function(ele,index){
                Question.findOne({'_id': ele},function(err,doc2){
                        if(err){
                            console.error('=== find error: ' + err);
                            res.send({'status': '服务端查询数据失败,获取数据失败','data': null});
                        }else{
                            count++;
                            data.push(doc2);
                            if(count === length){
                                let obj = {'status': '获取数据成功','data': data};
                                res.send(obj);
                            }
                        }
                }); 
               });
            }
        }) 
    })


module.exports = router;
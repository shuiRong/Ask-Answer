var express = require('express');
var router = express.Router();
require('../../database/connect');
var Question = require('../../database/question');
var User = require('../../database/user');

//监听  /api/getuserquestion
router.route('/')
    .get(function(req,res){
        let user = unescape(unescape(req.session.user));
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
                                if(count == length){
                                    let obj = {'status': '获取数据成功','data': data};       
                                    res.send(obj);
                                }
                            }
                    }); 
               });
            }
        }) 
    })

                                /*
data: 

[ { _id: 58b2782a42107f579979f515,
    title: '我是问题123',
    description: '我是问题123我是问题123我是问题123我是问题123我是问题123着',
    time: 2017-02-26T14:39:38.000Z,
    questionProducer: '水溶123',
    __v: 0,
    answers: [],
    tags: [ '我是问题123', '我是问题123', '我是问题123' ] },
  { _id: 58b2782842107f579979f514,
    title: '我是问题123',
    description: '我是问题123我是问题123我是问题123我是问题123我是问题123着',
    time: 2017-02-26T14:39:36.000Z,
    questionProducer: '水溶123',
    __v: 0,
    answers: [],
    tags: [ '我是问题123', '我是问题123', '我是问题123' ] }
]
                                                                                   */


module.exports = router;
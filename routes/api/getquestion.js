var express = require('express');
var router = express.Router();
require('../../database/connect');
var Question = require('../../database/question');

router.route('/')
    .post(function(req,res){
        Question.find({},function(err,doc){
            if(err){
                console.error('=== find error: ' + err);
            }else{
                let status = '';
                if(req.body.arr === 'popular'){
                    makePopular(doc);
                    status = '获取最热问题数据,成功!';
                }else if(req.body.arr === 'new'){
                    makeNew(doc);
                    status = '获取最新问题数据,成功!';
                }
                //console.log(doc);
                res.send({'status': status,data: doc});
            }
        })
    });


/*data: 

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
]*/

//按权重排序,最大的在上面
function makePopular(data){
    data.sort(function(a,b){
        return b.weight - a.weight;
    })
}

//按时间排序,最新的再上面
function makeNew(data){
    data.sort(function(a,b){
        return b.time - a.time
    })
}

module.exports = router;
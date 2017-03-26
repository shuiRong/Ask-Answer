var express = require('express');
var router = express.Router();
var async = require('async');
require('../../database/connect');
var Question = require('../../database/question');
var User = require('../../database/user');

// 首页 获取问题
router.route('/')
    .post(function(req,res){
        async.waterfall([
            function(callback){
                Question.find({},function(err,doc){
                    if(err){
                        callback(new Error(err.statusText));
                    }else{
                        let status = '';
                        if(req.body.arr === 'popular'){
                            makePopular(doc);
                            status = '获取最热问题数据,成功!';
                        }else if(req.body.arr === 'new'){
                            makeNew(doc);
                            status = '获取最新问题数据,成功!';
                        }
                        callback(null,doc);
                    }
                });
            },
            function(result,callback){
                async.each(result,function(item,callback){
                    User.findOne({'username': item.questionProducer},'avatar',function(err,doc2){
                        err ? callback(err) : item.avatar = doc2.avatar,callback(null);
                    });
                },function(err){
                    callback(err,result);
                });
            },
            function(result,callback){
                    res.send({'status': '查询首页问题成功',data: result});
                    callback(null);
            }
        ],function(err,results){
            err ? console.log('=== getquestion.js',err) : console.log(results);
        })
    });

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
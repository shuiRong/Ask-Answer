var express = require('express');
var router = express.Router();
require('../../database/connect');
var Question = require('../../database/question');
var User = require('../../database/user');

// 首页 获取问题
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
                //根据questionProducer 更新avatar:...
                doc.forEach(function(ele){
                    let status = false;
                    while(!status){
                        User.findOne({'username': ele.questionProducer},'avatar',function(err,doc2){
                            if(err){
                                console.error('=== findOne err ',err);
                            }else{
                                ele.avatar = doc2.avatar;
                                status = true;
                            }
                        });
                    }
                });
                res.send({'status': status,data: doc});
            }
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
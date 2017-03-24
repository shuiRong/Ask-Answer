var express = require('express');
var router = express.Router();
require('../../database/connect');
var User = require('../../database/user');

//返回 个人用户主页的回答,数据.
router.route('/')
    .get(function(req,res){
        let username = unescape(unescape(req.session.user));        
        User.findOne({'username': username},'answers',function(err,doc){
            if(err){
                console.error('=== find error: ',err);
            }else{
                res.send({status: '获取用户回答信息,成功!',data: doc.answers});
            }
        });        
    });

module.exports = router;
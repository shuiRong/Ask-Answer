var express = require('express');
var router = express.Router();
var User = require('../../database/user');

//返回用户主页需要的个人信息
router.route('/')
    .post(function(req,res){    
        User.find({'username': unescape(unescape(req.body.user))},function(err,doc){            
            res.send({data: doc[0]});
        });
    });

module.exports = router;
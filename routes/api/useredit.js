var express = require('express');
var router = express.Router();
var User = require('../../database/user');

router.route('/')
    .post(function(req,res){        
        console.log(req.body);
        let data = req.body;
        console.log()
        //res.redirect('/users/'+req.body.username);
        User.update({'username': data.username},{$set:{
            'sex': data.sex,
            'description': data.description,
            'address': data.address,
            'industry': data.industry,
            'carerrExperience': data.experience,
            'education': data.education,
            'introdution': data.introdution
        }},function(err,doc){
            if(err){
                console.error('=== update error: ',err);
            }else{
                console.log('<<< 更新用户编辑信息,成功!');
            }
        });
        res.send({status: '问题编辑页数据提交,成功!'});
    });

module.exports = router;
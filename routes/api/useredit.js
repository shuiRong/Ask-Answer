var express = require('express');
var router = express.Router();
var User = require('../../database/user');
var multer = require('multer');
var upload = multer({
    dest: 'uploads/avatars/'   //图片上传的地方
});
var xssFilters = require('xss-filters');

//更改用户编辑的个人信息
router.route('/')
    .post(upload.single('avatar'),function(req,res){
        //console.log(req);
        let username = unescape(req.session.user);
        let data = req.body;
        let tags = req.body.tags.split(/[,，;； ]/);        
        let avatar = req.file.path.replace(/uploads/,'');
        User.update({'username': username},{$set:{
            'avatar': avatar,
            'sex': data.sex,
            'description': data.description,
            'address': data.address,
            'industry': data.industry,
            'carerrExperience': data.experience,
            'education': data.education,
            'introdution': data.introdution,
            'tags': tags
        }},function(err,doc){
            if(err){
                console.error('=== update error: ',err);
            }else{
                console.log('<<< 更新用户编辑信息,成功!');
                //let url = data.originUrl.replace(/.{21}/,'');
                res.send({status: '用户信息更新成功！'});
            }
        });
       
    });

module.exports = router;
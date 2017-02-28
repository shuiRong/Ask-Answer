var express = require('express');
var router = express.Router();
require('../../database/connect');
var Tags = require('../../database/tags');

//监听路由路径,从数据库中获取标签数据.然后放回前端.
router.route('/')
    .get(function(req,res){
        Tags.find({},function(err,doc){
            let status = '';
            if(err){
                console.error('=== find tags error: ' + err);
                status = '从后端获取标签数据,失败!';
                res.send({status: status});
            }else{
                console.log('<<< 查询标签数据,成功!');
                status = '从后端获取标签数据,成功!';
                res.send({status: status,data:doc});
            }
        })
    });

module.exports = router;
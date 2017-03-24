var express = require('express');
var router = express.Router();

//监听登出按钮
router.route('/')
    .get(function(req,res){
        console.log('收到logout------------');
        let sess = req.session;
        sess.user = undefined;
        sess.isAuthed = false;        
        //这里有个坑: 当前端发送get/post请求时,无法直接从后端重定向页面. 也就是说: res.location(),res.redirect()没有效果. res.render() 也没有效果.只能在前端重定向:window.location.href= '...'
        res.end();
    });

module.exports = router;
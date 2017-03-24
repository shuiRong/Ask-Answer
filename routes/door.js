var express = require('express');
var router = express.Router();

//路由登录注册页
router.get('/', function(req, res, next) {
    let sess = req.session;
    console.log('---door.js: ',sess);
    //用验证session,看里面的isAuthed是否是true,是的话,获取到username,直接路由到index页面.
    if(sess.isAuthed){
        res.render('index',{username: sess.username});
    }else{
        res.render('door');
    }    
});

module.exports = router;

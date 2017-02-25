var express = require('express');
var router = express.Router();
var crypto = require('crypto');
require('../database/connect');  //不需要赋值给变量，是因为不需要。毕竟目的是让它执行。
var User = require('../database/user');

router.route('/')
  .get(function(req,res,next){
    //正常情况下 执行不到这里
    res.render('door');
  })
  .post(function(req,res,next){
   //从请求的表单中得到帐号密码和重复的密码
    let un = req.body.usernamename;
    let pw = req.body.passwordname;
    let pw2 = req.body.passwordname2;
    let ok = false;  // create account done ? true : false   此处ok作用和login.js的ok一样。不解释了
    
    //判断两次输入的密码一样不？ 本来不应该在这里判断的。应该在前端判断。不过为了安全吧，在这里加上也无妨。
    if(pw!==pw2){
      console.log('------两次输入的密码不一样------');
      res.redirect('/register');
      return;
    }
    //操作数据库，看用户输入的帐号是否已存在。
    User.findOne({username: un},function(err,doc){
      if(err){
        console.log('------finding err: ' + err);
      }else{
        if(doc){ //if the username is existed
          console.log('------帐号已存在了!------');
        }else{
          //create a hash instance of md5/创建一个MD5的hash实例
          var md5 = crypto.createHash('md5'); 
          md5.update(pw);
          pw = md5.digest('hex'); //把密码转换成16进制的字符串
          var user = new User({
            username: un,
            password: pw,
            'ask-question': [],
            'answers': []
          });
          user.save(function(err,doc){
            if(err){
              console.log('------save error: ' + err);
            }else{
              console.log('------save success: ' + doc);
            }
          });
          ok = true;
          console.log('------创建用户成功 !------');
        }
        //console.log('ok: ' + ok);
        //此处判断的原因和login的一样。
        if(ok){
          //
          res.redirect('/');
        }else{
          res.redirect('/');
        }
        
      }
    })
  });

module.exports = router;

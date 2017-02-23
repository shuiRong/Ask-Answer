var express = require('express');
var router = express.Router();
var crypto = require('crypto');
require('../database/connect');  //不需要赋值给变量，是因为不需要。毕竟目的是让它执行。
var User = require('../database/user'); //你看这歌赋值给变量了，因为目的是让其他模块的使用。


router.route('/')
  .get(function(req,res,next){
    //路由到此页面时,程序判断用户端是否存在connect.sid,也就是session.id.如果不存在
    //正常情况下执行不到这里
    res.render('door');
  })
  .post(function(req,res,next){
    console.log('触发post');
    
    //从请求的表单中得到帐号密码
    let un = req.body.usernamename;
    let pw = req.body.passwordname;
    let ok = false;  //log in done ? true : false
    //在数据库中查询是否存在此账号
    User.findOne({username: un},function(err,doc){
      if(err){
        console.log('------finding err: ' + err);
      }else{
        if(!doc){  
          console.log('------此帐号不存在-------');
        }else{
          //在帐号存在的条件下，查询此帐号的密码

          //create a hash instance of md5/创建一个MD5的hash实例
          var md5 = crypto.createHash('md5'); 
          md5.update(pw);
          pw = md5.digest('hex'); //把pw替换成16进制的加密过的字符串 这一过程是不可逆的
          User.findOne({username: un,password: pw},function(err,doc){
            if(err){
              console.log('------check password err: ' + err);
            }else{
              console.log(doc);
              if(doc!==null){
                console.log('-------登录成功------- !');                
                ok = true;                
              }else{
                console.log('--------密码错误,请重新输入---------');
              }
            }
            //console.log('ok: ' + ok)
            //重定向需要放到这里，放到前面的话，会报错。
            //所以加了个变量ok 判断帐号是否有问题
            if(ok){
              //如果登录成功,渲染主页,也可以说登录成功,就把index路由到/signin上
                console.log('登录成功');
                res.render('index',{username:un});
            }else{
                console.log('登录失败');
                res.redirect('/');
            }
          });
        }

      }

    })
  });


module.exports = router;

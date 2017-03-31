const express = require('express');
const router = express.Router();
const crypto = require('crypto');
require('../../database/connect');  //不需要赋值给变量，是因为不需要。毕竟目的是让它执行。
const User = require('../../database/user');
const TempUser = require('../../database/tempuser');
const moment = require('moment');
const async = require('async');

router.route('/')
    .get(function(req,res,next){
        let sess = req.session;
        //用验证session,看里面的isAuthed是否是true,是的话,获取到username,直接路由到index页面.
        if(sess.isAuthed){
            res.render('index',{username: sess.username});
        }else{
            res.render('door');
        }  
    })
    .post(function(req,res,next){
    //从请求的表单中得到帐号密码和重复的密码
        let data = dealForm(req.body);
        let ok = false;  // create account done ? true : false   此处ok作用和login.js的ok一样。不解释了
        console.log(data);
        async.waterfall([
            //中间的任何一个func出错，都会直接跳到最终的callback,后面的func不会被执行．
            //检查验证码是否正确．
            function(callback){
                TempUser.findOne({'email': data.email},function(err,doc){
                    err ? callback('______1' + err) : ( doc.captcha ==  data.captcha ? callback(null,doc) : callback('验证码不正确') );
                });
            },
            //加密密码存储信息到User里
            function(result,callback){
                //创建一个MD5的hash实例
                const md5 = crypto.createHash('md5'); 
                md5.update(result.password);
                result.password = md5.digest('hex'); //把密码转换成16进制的字符串
                let user = new User({
                    email: result.email,
                    username: result.username,
                    password: result.password
                });
                user.save(function(err,doc2){
                    err ? callback('______2' +err) : callback(null,'>>> 用户注册成功');
                })
            }
        ],function(err,result){
            err ? ( console.error('=== signup.js 出错: ',err),res.send({'status': 'DONE'}) ) : console.log(result),res.send({'status': 'FAILED'});
        });

        // //操作数据库，看用户输入的帐号是否已存在。
        // User.findOne({username: un},function(err,doc){
        //     if(err){
        //         console.log('------finding err: ' + err);
        //     }else{
        //         if(doc){ //if the username is existed
        //             console.log('------帐号已存在了!------');
        //         }else{
        //             //create a hash instance of md5/创建一个MD5的hash实例
        //             const md5 = crypto.createHash('md5'); 
        //             md5.update(pw);
        //             pw = md5.digest('hex'); //把密码转换成16进制的字符串
        //             const user = new User({
        //                 username: un,
        //                 password: pw,
        //                 'ask-question': [],
        //                 'answers': []
        //             });
        //             user.save(function(err,doc){
        //                 if(err){
        //                 console.log('------save error: ' + err);
        //                 }else{
        //                 console.log('------save success: ' + doc);
        //                 }
        //             });
        //             ok = true;
        //             console.log('------创建用户成功 !------');
        //         }
        //         //console.log('ok: ' + ok);
        //         //此处判断的原因和login的一样。
        //         if(ok){
        //             res.redirect('/');
        //         }else{
        //             res.redirect('/');
        //         }
                
        //     }
        // })
    });

let dealForm = function(data){
    let obj = {};
    let arr = ['email','username','password','password2','captcha'];
    arr.forEach(function(ele){
        if(ele){
            obj[ele] = data['form[' + ele + ']'];
        }
    });
    return obj;
}


module.exports = router;

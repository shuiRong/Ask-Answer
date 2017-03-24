var express = require('express');
var router = express.Router();
var crypto = require('crypto');
require('../../database/connect');  //不需要赋值给变量，是因为不需要。毕竟目的是让它执行。
var User = require('../../database/user'); //你看这歌赋值给变量了，因为目的是让其他模块的使用。


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
                        //如果登录成功,渲染主页,也可以说登录成功,就把index路由到/signin上.同时把用户名存到cookie里
                            console.log('登录成功');
                            //存到cookie里一份,这里的username,只做其他地方展示用户名用,并不被后端信任!!!
                            //关系到用户上传表单,回答问题什么的还得靠session中的user
                            res.cookie('user',escape(un),{maxAge: 1000 * 60 * 60 * 24 * 7});
                            req.session.user = escape(un);
                            req.session.isAuthed = true;
                            res.render('index');
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

const express = require('express');
const router = express.Router();
const mail = require('../../selfModules/mail');
const TempUser = require('../../database/tempuser');
// const async = require('async');
const moment = require('moment');

router.route('/')
    .post(function(req,res){
        let data = req.body;
        let tempuser = new TempUser(dealForm(data));
        tempuser.save(function(err,doc){
            err ? console.error('=== ',err) : mail(tempuser.email,tempuser.captcha)
            ,res.send({'status': '邮件发送成功'});
        });
    });


let dealForm = function(data){
    let obj = {};
    let arr = ['email','username','password','password2'];
    arr.forEach(function(ele){
        obj[ele] = data['form[' + ele + ']'];
    });
    obj["date"] = new moment().format();
    let captcha = Math.floor(Math.random()*1000000);
    if(String(captcha).length < 6){  //验证码不够6位的话，加个＇４＇;
        captcha = captcha + '4';
    }
    obj["captcha"] = captcha;
    return obj;
}


module.exports = router;
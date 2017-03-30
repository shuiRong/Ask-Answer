//邮件发送模块.辅助注册验证
const nodemailer = require('nodemailer');
//导入配置文件，里面有你的邮箱帐号密码．
const config = require('../config.json');

let transporter = nodemailer.createTransport({
    host: 'smtp.sina.com',
    // service: 'sina',
    port: 25,
    auth: {
        user: config.sinaAcc,
        pass: config.sinaPass
    }
});

let mail = function(to,captcha){
    let mailOptions = {
        "from": config.sinaAcc,
        "to": to,
        "subject": '[邮箱验证]不知-与世界分享你刚编的故事',
        "text": 'JavaScript Will Rule The Wrold',
        "html": '<span>你的验证码是：　</span>' + captcha,
    };

    transporter.sendMail(mailOptions,function(error,info){
        error ? console.log(error) : console.log('>>> 验证邮件发送成功 : ',info.response);
    });

};

module.exports = mail;
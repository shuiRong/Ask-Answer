//暂存用户注册信息，用户邮箱验证正确后再存到User里
var mongoose = require('mongoose');

TempUserSchema = new mongoose.Schema({
    'email': {
        type: String,
        required: true
    },
    'username': {
        type: String,
        requierd: true
    },
    'password': {
        type: String,
        required: true
    },
    'password2': {
        type: String,
        required: true
    },
    'captcha': {
        type: String
    },
    'date': { //向对应用户发送验证邮件的时间
        type: String,
        required: true
    }
});

var TempUserModel = mongoose.model('tempuser',TempUserSchema);


module.exports = TempUserModel;
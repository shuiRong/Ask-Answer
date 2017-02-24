//定义 '回答' 的模型

var mongoose = require('mongoose');

AnswerSchema = new mongoose.Schema({
    answerProducer: { //回答的生产者
        type: String, // 某人
        required: true
    },
    answerContent: { //回答的内容
        type: String,
        required: true
    },
    time: { //回答被创建的时间
        type: Date,
        required: true
    }
});

//定义Model。（不是创建Model哦）至于区别，找篇文章看把。
var AnswerModel = mongoose.model('answer',AnswerSchema);


module.exports = AnswerModel;
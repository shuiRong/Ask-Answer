//定义 '回答' 的模型

var mongoose = require('mongoose');

AnswerSchema = new mongoose.Schema({
    answerProducer: { //回答的生产者
        type: String, // 某人
        required: true
    },
    answerContent: { //回答的内容md版,可能之后会被程序渲染成带html标签的回答
        type: String,
        required: true
    },
    time: { //回答被创建的时间
        type: Date,
        required: true
    },
    weight: { //回答的权重. 暂且等于(赞同-反对)数
        type: Number,
        default: 0   //默认是0
    },
    voter: { //对这个答案点赞或者反对的人. [['林水溶',1]}]  //1 代表赞,0代表反对
        type: Array
    },
    avatar: { //回答者的头像的路径
        type: String,
    }
});

//定义Model。（不是创建Model哦）至于区别，找篇文章看把。
var AnswerModel = mongoose.model('answer',AnswerSchema);


module.exports = AnswerModel;
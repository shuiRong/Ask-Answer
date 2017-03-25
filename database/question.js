//定义 '问题' 的模型
var mongoose = require('mongoose');

QuestionSchema = new mongoose.Schema({
  title: { //问题标题
    type: String,
    require: true
  },
  description: {  //问题描述
    type: String,
    required: true
  },
  tags: {  //问题标签 直接存字符串.
    type: [],
    required: true
  },
  time: { //问题创建时间
    type: Date,
    required: true
  },
  questionProducer: { //问题提出者
    type: String, //存储名字吧
    required: true 
  },
  answers: { //问题的回答的id
    type: []
  },
  weight: {  //问题的权重
    type: Number,
    default: 0
  },
  avatar: { //问题提出者的头像URL
    type: String
  }
});

//定义Model。（不是创建Model哦）至于区别，找篇文章看把。
var QuestionModel = mongoose.model('question',QuestionSchema);


module.exports = QuestionModel;
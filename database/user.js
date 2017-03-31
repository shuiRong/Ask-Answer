//模型定义代码。从‘操作数据库’中分离出来。喜欢这种风格...

var mongoose = require('mongoose');
//定义Schema。第一次看到这玩意儿，想起来了Java的类定义。你看多像啊。
UserSchema = new mongoose.Schema({
  'username': { //account
    type: String,
    require: true
  },
  'password': { //password
    type: String,
    required: true
  },
  'avatar': {  //用户的头像在服务器的path
    type: String,
    default: '/avatars/f472321005ffb7e862f44bc105eb9a0d'
  },
  'askQuestions': { //提问的问题,id值存在数组里
    type: [],
    default: []
  },
  'sex': {   //性别
    type: String,
    default: '其他'
  },
  'answers': { // 回答的问题,id值存在数组里
    type: [],
    default: []
  },
  'description': {   //个人描述
    type: String,
    default: ''
  },
  'address': {   // 地址
    type: String,
    default: ''
  },
  'industry': {  // 所属行业
    type: String,
    default: ''
  },
  'carerrExperience': {  //职业经历
    type: String,
    default: ''
  },
  'education': {   //教育程度
    type: String,
    default: ''
  },
  'introdution': {  // 自我介绍
    type: String,
    default: ''
  },
  'tags': { //标签
    type: [],
    default: []
  },
  'email': {
    type: String,
    default: ''
  }
});

//定义Model。（不是创建Model哦）至于区别，找篇文章看把。
var UserModel = mongoose.model('user',UserSchema);


module.exports = UserModel;
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
    type: String
  },
  'askQuestions': { //提问的问题,id值存在数组里
    type: [],
  },
  'sex': {   //性别
    type: String
  },
  'answers': { // 回答的问题,id值存在数组里
    type: []
  },
  'description': {   //个人描述
    type: String
  },
  'address': {   // 地址
    type: String
  },
  'industry': {  // 所属行业
    type: String
  },
  'carerrExperience': {  //职业经历
    type: String
  },
  'education': {   //教育程度
    type: String
  },
  'introdution': {  // 自我介绍
    type: String
  },
  tags: { //标签
    type: []
  }
});

//定义Model。（不是创建Model哦）至于区别，找篇文章看把。
var UserModel = mongoose.model('user',UserSchema);


module.exports = UserModel;
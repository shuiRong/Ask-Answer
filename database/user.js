//模型定义代码。从‘操作数据库’中分离出来。喜欢这种风格...

var mongoose = require('mongoose');
//定义Schema。第一次看到这玩意儿，想起来了Java的类定义。你看多像啊。
UserSchema = new mongoose.Schema({
  username: { //account
    type: String,
    require: true
  },
  password: { //password
    type: String,
    required: true
  },
  'ask-question': { //提问的问题,id值存在数组里
    type: []
  },
  'ans-question': { // 回答的问题,id值存在数组里
    type: []
  }
});

//定义Model。（不是创建Model哦）至于区别，找篇文章看把。
var UserModel = mongoose.model('user',UserSchema);


module.exports = UserModel;
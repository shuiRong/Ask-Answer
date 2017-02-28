//定义 '问题' 的模型
var mongoose = require('mongoose');

TagsSchema = new mongoose.Schema({
  tagName:{
      type: String,
      required: true
  }
});

var TagsModel = mongoose.model('tag',TagsSchema);

module.exports = TagsModel;
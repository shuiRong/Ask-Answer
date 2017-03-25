var express = require('express');
var router = express.Router();
//引入时间模块,更本土化的处理方式.
var moment = require('moment');
require('../../database/connect');
var Question = require('../../database/question');
var User = require('../../database/user');
var Tag = require('../../database/tags');

//监听  /api/newquest   把用户提交的问题存起来
router.route('/')
    .post(function(req,res){
        //再次处理下
        let quest = req.body;
        let sess = req.session;
        quest.time = new moment().format(); //加入问题提交的时间  2017-02-24T19:31:42+08:00
        quest.time = new moment().format().replace(/\+.*/,''); 
        quest.tags = quest.tags.split(/[,，; ]/);
        let user = unescape(unescape(sess.user));
        let question = new Question({
            title: quest.title,
            description: quest.description,
            tags: quest.tags,
            time: quest.time,
            questionProducer: user,
            avatar: ''
        });
        User.findOne({'username': user}, 'avatar',function(err,doc3){
            if(err){
                console.error('=== findOne error ',err);
            }else{
                question.avatar = doc3.avatar;

                question.save(function(err,doc){
                    if(err){
                        console.error('=== Question save error!' + err);
                    }else{
                        console.info('>>> Questoin save success!');
                        //把此问题的_id 添加到 此用户的数据里
                        let questionIds = [doc['_id']];     
                        // 获取之前的 ask-question 数组里的信息并合成新的
                        User.findOne({'username': user},'askQuestions',function(err,doc2){
                            if(err){
                                console.error('=== find askQuestions of User error: ' + err);
                            }else{
                                //获取用户之前的问题id,然后和新问题的id合并
                                questionIds = questionIds.concat(doc2['askQuestions']); 
                                //他娘的,忘了mongoose的CRUD操作都是异步执行的,坑死我了. 差一点怀疑人生,从此弃坑!!!
                                User.updateOne({'username': user},{$set:{'askQuestions': questionIds}},function(err,number){
                                    if(err){
                                        console.error('=== error: ' + err);
                                    }else{
                                        console.log('<<< 更新用户提问 数据: 成功! ');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });


        //循环遍历每个标签,如果数据库里有就什么都不做,如果没有就存进去.
        let tagsArr = quest.tags;
        tagsArr.forEach(function(ele){           
            Tag.findOne({'tagName': ele},function(err,doc){
                if(err){
                    console.error('=== tag find error: ' + err);
                }else{
                    if(doc==null){
                        let tag = new Tag({
                            tagName: ele
                        });
                        tag.save(function(err,doc2){
                            if(err){
                                console.error('=== tag save error: ' + err);
                            }else{
                                console.log('<<< 标签存储成功 !');
                            }
                        });
                    }else{
                        console.log('<<< 数据库中,目标标签已存在,什么都不做');
                    }
                }
            });
        });
        
        res.send('问题提交成功!');
    })





module.exports = router;
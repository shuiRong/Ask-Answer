var express = require('express');
var router = express.Router();
require('../../database/connect');
var Question = require('../../database/question');
var Answer = require('../../database/answer');
var User = require('../../database/user');
var moment = require('moment');
var xssFilters = require('xss-filters');

//对新提交的回答处理.
router.route('/')
    .post(function(req,res){       
        let ansObj = req.body;
        let answer = new Answer({
            answerProducer: req.session.user,
            answerContent: xssFilters.inHTMLData(ansObj.answer),
            time: new moment().format(),
            avatar: '', //回答者的头像
        });                
        //记录回答存储状态
        let satus = '';
        User.findOne({'username': unescape(unescape(req.session.user))},'avatar',function(err,doc4){
            if(err){
                console.error('=== findOne error: ',err);
            }else{
                answer.avatar = doc4.avatar;

                answer.save(function(err,doc){
                    if(err){
                        console.error('=== 答案存储出错',err);
                        status = '回答存储失败!';
                        res.send({status: status});
                    }else{                
                        let answerID = doc['_id'];
                        //把用户回答的标题,id,内容,id,时间,用户名存到用户collection里
                        storeUserAns.call(this,ansObj.questionTitle,ansObj.question,ansObj.answer,answerID,answer.time,unescape(unescape(req.session.user)));
                        //把问题的answers数组取出来.
                        let answers = [answerID];                
                        Question.findOne({'_id': ansObj.question},'answers',function(err,doc2){
                            if(err){
                                console.error('=== find error',err);
                            }else{                                                
                                answers = answers.concat(doc2.answers);
                                Question.update({'_id': ansObj.question},{$set:{'answers': answers}},function(err,doc3){
                                    if(err){
                                        console.error('=== find error',err);
                                        status = '回答存储失败!';
                                        res.send({status: status});
                                    }else{
                                        console.log('<<< 存储新的回答,成功!');
                                        status = '回答存储成功!'
                                        res.send({status: status});
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

    });

//把用户回答的标题,id,内容,id,时间,用户名存到用户collection里
function storeUserAns(title,titleID,content,contentID,time,user){
    let userAnsArr = [];
    User.findOne({'username': user},'answers',function(err,doc){    
        if(err){
            console.error('=== find error ',err);
        }else{
            if(doc.answers){
                userAnsArr = doc.answers ;
            }
            let answers = {
                title: title,
                titleID: titleID,
                content: content,
                contentID: contentID,
                time: time
            };
            userAnsArr.push(answers);
            User.update({'username': user},{$set:{'answers': userAnsArr}},function(err,doc2){
                //成功讲回答相关信息存储到用户collection里
            });
        }
    })
}



module.exports = router;

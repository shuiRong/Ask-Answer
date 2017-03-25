var express = require('express');
var router = express.Router();
var Answer = require('../../database/answer');
/*
    监听用户点赞或反对,更新到数据库里

    'voter':[user,1,1]   记录点赞或反对的用户.第二个参数表示用户点的up(1)/down(0),第三个表示用户点击up/down的次数(1,2).
    在接口程序里判发现如果之前存在此用户信息的话,删掉,重新添加.之前没有的话,添加.
*/

router.route('/')
    .post(function(req,res){
        let data = req.body;      
        //更新回答的权重,回答的voter,即点赞反对者的用户名和行为
        let voter;
        // 不知为何,传过来的json的voter属性变成这个了.   data['voter[]'];
        let dataVoter = data['voter[]'];
        //覆盖前端传来的user.因为传来的user来自cookie,不被信任.可以防XSS
        dataVoter[0] = req.session.user;
        Answer.findOne({'_id': data.answerID},'voter',function(err,doc){
            if(err){
                console.error('=== findOne error: ',err);
            }else{                
                voter = doc.voter;
                voter = deleteUser(dataVoter[0],voter) //这个voter里已经没有此用户的信息了
                voter.push(dataVoter);//然后把新的添加进去
                Answer.update({'_id': data.answerID},{$set:{'voter': voter,'weight': data.arr}},function(err,doc2){
                    err ? console.error('=== update error',err) : console.log('回答的voter和权重更新成功');
                });
            }            
        });
    });

//返回一个新二维数组，有user不是username的一味数组组成
function deleteUser(username,voter){
    let newArr = [];
    voter.forEach(function(ele,index){
        if(ele[0] !== username){
            newArr.push(ele);
        }
    });
    return newArr;
}


module.exports = router;
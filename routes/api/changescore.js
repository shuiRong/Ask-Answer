var express = require('express');
var router = express.Router();
var Answer = require('../../database/answer');
/*
    监听用户点赞或反对,更新到数据库里

    'voter':[user,1,1]   记录点赞或反对的用户.第二个参数表示用户点的up/down,第三个表示用户点击up/down的次数.
    在接口程序里判发现如果之前存在此用户信息的话,删掉,重新添加.之前没有的话,添加.
*/

router.route('/')
    .post(function(req,res){
        let data = req.body;      
        //更新回答的权重,回答的voter,即点赞反对者的用户名和行为
        let voter;
        let dataVoter = data['voter[]'];
       // 不知为何,传过来的json的voter属性变成这个了.   data['voter[]'];
        Answer.findOne({'_id': data.answerID},'voter',function(err,doc){
            if(err){
                console.error('=== findOne error: ',err);
            }else{                
                voter = doc.voter;
                let index = findUser(dataVoter[0],voter) //检查是否此用户名在数据库里
                console.log(index);
                if(index){  //在的话,删除掉再说
                    voter.splice(index,1);
                }
                console.log(voter);
                voter.push(dataVoter);            

                Answer.update({'_id': data.answerID},{$set:{'voter': voter,'weight': data.arr}},function(err,doc2){
                    err ? console.error('=== update error',err) : console.log('回答的voter和权重更新成功');
                });
            }            
        });
    });

//用户名在voter里的话,就return 下标,否则return false
function findUser(username,voter){
    let status = undefined;
    voter.forEach(function(ele,index){
        if(ele[0] == username){
            status = index;
        }
    });
    return status;
}


module.exports = router;
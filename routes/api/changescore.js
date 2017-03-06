var express = require('express');
var router = express.Router();
var Answer = require('../../database/answer');

router.route('/')
    .post(function(req,res){
        let data = req.body;
        let weight;
        console.log(data);
        Answer.findOne({'_id': data.answerID},'weight',function(err,doc){
            weight =  doc.weight;           
            weight = Number(data.arr) + weight;
            Answer.update({'_id': data.answerID},{$set:{'weight': weight}},function(err,doc2){
                console.log(doc2);
            });
        });
    });

module.exports = router;
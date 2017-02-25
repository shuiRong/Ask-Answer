var express = require('express');
var router = express.Router();
require('../../database/connect');
var Question = require('../../database/question');

//监听  /api/getuserquestion
router.route('/')
    .post(function(req,res){
        
        let user = req.body.username;
        
        res.send('问题提交成功!');
    })





module.exports = router;
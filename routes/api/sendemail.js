var express = require('express');
var router = express.Router();
var mail = require('./selfModules/mail.js');

router.route('/')
    .post(function(req,res){
        
    });

mail('798832028@qq.com',12315343);

module.exports = router;
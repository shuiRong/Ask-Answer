var express = require('express');
var router = express.Router();

router.route('/')
    .post(function(req,res){
        console.log('`````````````````');
        console.log(req.body);
    });

module.exports = router;
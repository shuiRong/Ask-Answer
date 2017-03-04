var express = require('express');
var router = express.Router();

router.route('/')
    .post(function(req,res){        
        console.log(req.body);
        //res.redirect('/users/'+req.body.username);
        
       res.send({status: '问题编辑页数据提交,成功!'});
    });

module.exports = router;
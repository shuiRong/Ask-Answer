var express = require('express');
var router = express.Router();

router.all('/',function(req,res,next){
	var data = {
		id: 001,
		title: '老人摔倒到底该不该扶？',
		description: '老人摔倒到底该不该扶的描述部分',
		name: '林水溶001',
		time: '2017-1-28-20-10-45'
	}
	res.json(data);
});

module.exports = router;
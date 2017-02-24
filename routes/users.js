var express = require('express');
var router = express.Router();


router.route('/')
	.all(function (req, res) {
		
		let user = unescape(req.cookies.user);
		res.render('userPage',{
			username: user,
			motto: '程序员,继承并重载了"人"的优缺重载了"人"的优缺重载了"人"点',
			selfTags: ['幽默','机智','悲观','理想']
		});
	});

module.exports = router;

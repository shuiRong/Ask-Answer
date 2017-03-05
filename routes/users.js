var express = require('express');
var router = express.Router();


router.route('/')
	.all(function (req, res) {
		
		let user = unescape(req.cookies.user);
		res.render('userPage');
	});

module.exports = router;

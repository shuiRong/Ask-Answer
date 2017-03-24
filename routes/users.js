var express = require('express');
var router = express.Router();


router.route('/')
	.all(function (req, res) {
		console.log('---user.js: ',req.session);
		if(!req.session.isAuthed){
			res.redirect('/');
		}else{
			let user = unescape(req.cookies.user);
			res.render('userPage');
		}
	});

module.exports = router;

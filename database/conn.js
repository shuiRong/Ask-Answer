var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://127.0.0.1:27017/test',function(err,db){
	if(err){
		throw err;
	}

	db.collection('restaurants').find({'grades.score':{$gt:95}}).toArray(function(err,result){
		if(err){
			throw err;
		}

		console.log(result);
	})
})

module.exports = MongoClient;
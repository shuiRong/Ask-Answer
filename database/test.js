var mongodb = require('mongodb');
var server = new mongodb.Server('localhost',27017,{auto_reconnect:true});
var db = new mongodb.Db('local',server);
/*
db.open(function(err,db){
	if(!err){
		console.log('connect db --ing');

		db.collection('content',function(err,collection){
			if(err){
				console.log(err);
			}else{
				var temp1 = {id:'1',title:'hello',number:1};
				var temp2 = {id:'2',title:'world',number:2};
				collection.insert([temp1,temp2],function(err,result){
					if(err){
						throw err;
					}
					console.log('result----------------');
					console.log(result);
					console.log('++++++++++++++++++++++');
				});

				collection.find().toArray(function(err,docs){
					if(err){
						throw err;
					}
					console.log('find---------------');
					console.log(docs);
					console.log('++++++++++++++++++++++');
				});


				collection.update({title:'hello'}, {$set:{number:5}},{multi:true},function(err,result){

				});

				collection.find().toArray(function(err,docs){
					if(err){
						throw err;
					}
					console.log('find2--------------');
					console.log(docs);
					console.log('++++++++++++++++++++++');
				});
			}
		});
	}else{
		console.log(err);
	}
})
*/

function insertFunc(jsonData){
	db.open(function(err,db){
		if(!err){
			console.log('connectting database !');
			db.collection('content',function(err,collection){
				if(err){
					console.log(err);
				}else{
					collection.insert(jsonData,function(err,result){
						if(err){
							throw err;
						}
						console.log('insert jsonData into collection! DONE!');
					});
				}
			})
		}else{	
			console.log(err);
		}
	})
}

module.exports = insertFunc;
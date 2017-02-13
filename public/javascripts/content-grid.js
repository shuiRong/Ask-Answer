
var url = 'https://127.0.0.1:3000/json/index.json'

/*$.getJSON(url,function(data){
	console.log(data);
});
*/

fetch(url).then(function(res){
	if(res.ok){
		res.json().then(function(data){
			console.log(data);
		})
	}else{
		console.log('error status code: ', res.status);
	}
},function(e){
	console.log('fetch failed:',e);
});

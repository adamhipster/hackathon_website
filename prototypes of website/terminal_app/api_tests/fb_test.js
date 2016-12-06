let graph = require('fbgraph');
let app_id = '221425754963641';
let app_secret = '3ff06b57c1d0f76734cc6bad51fb3e8f';
// let access_token = app_id+'|'+app_secret;
let access_token = 'EAACEdEose0cBAAOJx0eo1t9mwPeLtDGqNDYhspxHDAN0DUwAR7JK0MmWAezwZBrWpoqYYAAkvhoZAMPbeahFGre61DuzhxtU2JZCZAVFV5AFTi33pXTPl33BYTFDxgGVGZBZADwD1zLZASquulQhVEZBQRImt8ZC438TxUcsB2s2dLQZDZD';

graph.setAccessToken(access_token);

// graph
// .get("/search?q=hackathon&type=event", function(err, res) {

// 	res.data.forEach(function(element){
// 		console.log(element.place);
// 	});
// });

graph.get("/search?q=hackathon amsterdam&type=event", {limit: 5}, function(err, res) {
	logEvents(err, res, 25);
});


function logEvents(err, res, n){
	res.data.forEach(function(element){
		if(element.name) console.log(element.name);
	});
	console.log('\nnext page\n');
	nextPage(err, res, n-1);
	
}

function nextPage(err, res, n){
	console.log(n);
	console.log(res.paging);
	if(n<1){
		return;
	}
	else if(res.paging && res.paging.next) {
		graph.get(res.paging.next, {limit: 5}, function(err, res){
			logEvents(err, res, n);
		});
	}
	else{
		return;
	}
}

// let eventsPromise = new Promise(function(resolve, reject){
// 	graph.get("/search?q=hackathon&type=event", function(err, res) {
// 		if(err) reject('err1');
// 		else return res;
// 	});
// });

// eventsPromise.then( function(events){
// 	return nextPage;
// });


// function nextPage(events){
// 	if(events.paging && events.paging.next){
// 		return graph.get(events.paging.next, logEvents);
// 	}
// }

/*
TO DO:
{ name: 'Montessorilaan 3, 6525 HR Nijmegen, Nederland' }
op zowel place.location.country en place.name text matchen op:
- Nederland en Netherlands
- Alle Nederlandse steden
*/
var meetup = require('meetup-api')({
    key: '556c3034d57406c565b451274344b71' 
});

meetup.getOpenEvents({
	'lon': '4.895168',
	'lat': '52.370216',
	'radius': '100'
},  function(error, events) {
    if (error) {
        console.log(error);
    } else {
        
    	const hackEvents = events.results.filter(function(element){
    		if(/hack/.test(JSON.stringify(element))){
    			return element;
    		}
    	});
    	console.log(hackEvents);

    }
});

function isBigEnough(value) {
  return value >= 10;
}
var filtered = [12, 5, 8, 130, 44].filter(isBigEnough);
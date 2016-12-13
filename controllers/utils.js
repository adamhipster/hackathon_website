exports.redirectToView = function dispatchView(req, res, views, ref){
	for (const routeNameKey in views){
		if(ref.includes(routeNameKey)){
			const redirectUrl = views[routeNameKey];
			res.redirect(redirectUrl);
			return true;
		}
	}
	return false;
}

//middle processing is not needed, so this function also won't see the light of day.
exports.createHackathonObject = function createHackathonObject(b){
		const hackathon = {
			name: b.name,
			topic: b.topic,
			start_date: b.start_date,
			end_date: b.end_date,
			url: b.url,
		};
		const location = {
			city: b.city,
			address_name: b.address_name,
			address_number: b.address_number,
		}
		return {
			hackathon: hackathon,
			location: location,
		}
}

//most likely not needed anymore, but let's keep it anyway.'
//Lol, the new function is exactly the same.
exports.dispatchView = function dispatchView(req, res, views, ref){
	for (const routeNameKey in views){
		if(ref.includes(routeNameKey)){
			const viewValueFunc = views[routeNameKey];
			viewValueFunc(req, res);
			return true;
		}
	}
	return false;
}
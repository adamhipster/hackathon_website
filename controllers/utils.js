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
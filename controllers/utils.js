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
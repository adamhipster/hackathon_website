const model = require('../models/sequelize_db.js');

exports.root = (req, res) => {
	const viewContext = {};
	res.render('admin/index', viewContext);
}

exports.dashboard = (req, res) => {
	model.getUnprocessedHackathons()
	.then( (hackathons) => {
		const viewContext = {hackathons: hackathons};	
		res.render('admin/dashboard', viewContext);
	});
};

//acts as a hook
exports.authenticated = (req, res) => {
	const viewContext = {};
	res.redirect('/admin/dashboard');
};

exports.logout = (req, res) => {
	req.logout();
	res.redirect('/');
}

exports.deleteHackathon = (req, res) => {
	const id = req.params.id;
	model.deleteHackathonById(id)
	.then( (deletionMessage) => {
		console.log(deletionMessage);
		res.redirect('/admin/dashboard');
	});
};

exports.processHackathon = (req, res) => {
	const isRealEvent = req.query.isRealEvent;
	const id = req.params.id;
	model.setSpamAttrForHackathonById(id, isRealEvent) //also sets `unprocessed = false`
	.then( (message) => {
		console.log(message);
		res.redirect('/admin/dashboard');
	});
};
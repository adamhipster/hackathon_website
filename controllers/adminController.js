const model = require('../models/sequelize_db.js');


exports.dashboard = (req, res) => {
	model.getUnprocessedHackathons()
	.then( (hackathons) => {
		const viewContext = {hackathons: hackathons};	
		res.render('admin/dashboard', viewContext);
	});
};

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
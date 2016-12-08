const model = require('../models/sequelize_db.js');

exports.root = (req, res) => {
	const viewContext = {};
	res.render('admin/index', viewContext);
}

//dashboard komt in het menu te staan en krijgt leuke knoppen om op te klikken
exports.dashboard = (req, res) => {
	model.getUnprocessedHackathons()
	.then( (hackathons) => {
		const viewContext = {hackathons: hackathons};	
		res.render('admin/dashboard', viewContext);
	});
};

//formerly known as dashboard
exports.approveHackathons = (req, res) => {
	model.getUnprocessedHackathons()
	.then( (hackathons) => {
		const viewContext = {hackathons: hackathons};	
		res.render('admin/dashboard', viewContext);
	});
};

exports.liveHackathons = (req, res) => {
	model.getRealHackathons()
	.then( (hackathons) => {
		const viewContext = {
			hackathons: hackathons, 
		};	
		res.render('admin/live_hackathons', viewContext);
	});
};

exports.deletedHackathons = (req, res) => {
	model.getDeletedHackathons()
	.then( (hackathons) => {
		const viewContext = {
			hackathons: hackathons, 
		};	
		res.render('admin/deleted_hackathons', viewContext);
	});
};

exports.logout = (req, res) => {
	req.logout();
	res.redirect('/');
}

exports.addHackathon = (req, res) => {
	const b = req.body;
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
	const isSpam = false;
	const isUnprocessed = false;
	model.addHackathon(hackathon, location, isSpam, isUnprocessed)
	.then( (result) => {
		res.send(result);
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
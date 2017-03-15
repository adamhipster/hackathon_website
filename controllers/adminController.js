const model = require('../models/sequelize_db.js');
const redirectToView = require('./utils').redirectToView;

exports.root = (req, res) => {
	const viewContext = {};
	res.render('admin/index', viewContext);
}

//dashboard komt in het menu te staan en krijgt leuke knoppen om op te klikken
exports.dashboard = (req, res) =>{
	const viewContext = {
		serverMessage: req.session.serverMessage
	};
	if(viewContext.serverMessage) res.setHeader('Cache-Control', 'no-cache, no-store');
	req.session.serverMessage = null;
	res.render('admin/dashboard', viewContext);
};

//formerly known as dashboard
exports.approveHackathons = (req, res) => {
	model.getUnprocessedHackathons()
	.then( (hackathons) => {
		const viewContext = {
			hackathons: hackathons,
			serverMessage: req.session.serverMessage,
		};	
		if(viewContext.serverMessage) res.setHeader('Cache-Control', 'no-cache, no-store');
		req.session.serverMessage = null;
		res.render('admin/approve_hackathons', viewContext);
	});
};

exports.liveHackathons = (req, res) => {
	model.getRealHackathons()
	.then( (hackathons) => {
		const viewContext = {
			hackathons: hackathons, 
			serverMessage: req.session.serverMessage,
		};
		if(viewContext.serverMessage) res.setHeader('Cache-Control', 'no-cache, no-store');
		req.session.serverMessage = null;
		res.render('admin/live_hackathons', viewContext);
	});
};

exports.deletedHackathons = (req, res) => {
	model.getDeletedHackathons()
	.then( (hackathons) => {
		const viewContext = {
			hackathons: hackathons, 
			serverMessage: req.session.serverMessage,
		};
		if(viewContext.serverMessage) res.setHeader('Cache-Control', 'no-cache, no-store');
		req.session.serverMessage = null;
		res.render('admin/deleted_hackathons', viewContext);
	});
};

exports.spammedHackathons = (req, res) => {
	model.getSpammedHackathons()
	.then( (hackathons) => {
		const viewContext = {
			hackathons: hackathons, 
			serverMessage: req.session.serverMessage,
		};
		if(viewContext.serverMessage) res.setHeader('Cache-Control', 'no-cache, no-store');
		req.session.serverMessage = null;
		res.render('admin/spammed_hackathons', viewContext);
	});
};

exports.logout = (req, res) => {
	req.logout();
	res.redirect('/');
}

exports.addHackathon = (req, res) => {
	const isSpam = false;
	const isUnprocessed = false;
	model.addHackathon(req.body, isSpam, isUnprocessed)
	.then( (hackathon) => {
		req.session.serverMessage = "Hackathon " + hackathon.id + " gehouden in " + hackathon.location.city + " is toegevoegd!";
		const views = {
			dashboard: '/admin/dashboard', 
			approve: '/admin/approve_hackathons',
			live: '/admin/live_hackathons', 
			delete: '/admin/deleted_hackathons', 
			spammed: '/admin/spammed_hackathons',
		};
		if(!redirectToView(req, res, views, req.headers.referer))
			res.end('it shouldnt come to this');
	});
};

exports.deleteHackathon = (req, res) => {
	const id = req.params.id;
	model.deleteHackathonById(id)
	.then( (deletionMessage) => {
		req.session.serverMessage = "Hackathon " + id + " is verwijderd met:" +  deletionMessage;
		const ref = req.headers.referer;
		const views = {
			approve: '/admin/approve_hackathons', 
			live: '/admin/live_hackathons'
		};
		if(!redirectToView(req, res, views, req.headers.referer))
			res.end('it shouldnt come to this');
	});
};

//take inspiration from the addhackathon method
exports.editHackathon = (req, res) => {
	const isSpam = false;
	const isUnprocessed = false;
	const id = req.params.id;
	
	model.editHackathonById(id, req.body)
	.then( (editMessage) => {
		req.session.serverMessage = "Hackathon " + id + " is bewerkt";
		const ref = req.headers.referer;
		const views = {
			live: '/admin/live_hackathons'
		};
		if(!redirectToView(req, res, views, req.headers.referer))
			res.end('it shouldnt come to this');
	});
};

exports.processHackathon = (req, res) => {
	let isRealEvent = req.query.isRealEvent;
	const id = req.params.id;
	model.setSpamAttrForHackathonById(id, isRealEvent) //also sets `unprocessed = false`
	.then( (message) => {
		req.session.serverMessage = "Hackathon " + id + " is vewerkt met: " + isRealEvent + " " + message;
		const views = {
			approve: '/admin/approve_hackathons',
		}
		if(!redirectToView(req, res, views, req.headers.referer))
			res.end('it shouldnt come to this');
	});
};
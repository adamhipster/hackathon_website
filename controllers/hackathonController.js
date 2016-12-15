const model = require('../models/sequelize_db.js');
reCAPTCHA=require('recaptcha2')
const moment = require('moment');
const dispatchView = require('./utils').dispatchView;
const encodeUrl = require('encodeurl');
const lang = 'en';

//TO DO: put in config file
recaptcha=new reCAPTCHA({
  siteKey:'6Lc4Gw4UAAAAAIANaqNWbLvalhbp_ORdREPBznej',
  secretKey:'6Lc4Gw4UAAAAAEOBaiXyh9SaEvv9ZKOyKRz0fsiY'
});

exports.wortel = (req, res) => {
 	model.getRealHackathons()
	.then( (hackathons) => {
		for (let hackathon of hackathons){
			let startDate = moment(hackathon.start_date).locale(lang).format('D');
			let startDay = moment(hackathon.start_date).locale(lang).format('dd');
			let startMonth = moment(hackathon.start_date).locale(lang).format('MMMM');
			let startYear = moment(hackathon.start_date).locale(lang).format('YY');
			let endDate = moment(hackathon.end_date).locale(lang).format('D');
			let endDay = moment(hackathon.end_date).locale(lang).format('dd');
			let endMonth = moment(hackathon.end_date).locale(lang).format('MMMM');
			let endYear = moment(hackathon.end_date).locale(lang).format('YY');
			
			let monthRenderString = startMonth;
			let dayRenderString = startDay + ' - ' + endDay;
			let dateRenderString = startDate + ' - ' + endDate;
			
			if (startMonth!==endMonth){
				startMonth = moment(hackathon.start_date).locale(lang).format('MMM');
				endMonth = moment(hackathon.end_date).locale(lang).format('MMM');
				monthRenderString = startMonth + ' - ' + endMonth;
			}
			if (startYear!==endYear){
				monthRenderString = startMonth + " '"+startYear+ ' - ' + endMonth +" '"+endYear;
			}

			hackathon.dateRenderString = dateRenderString;
			hackathon.dayRenderString = dayRenderString;
			hackathon.monthRenderString = monthRenderString;
		}
	
		const viewContext = {
			hackathons: hackathons,
			serverMessage: req.session.serverMessage, 
		};

		//back buttons should not be able to display messages
		if(viewContext.serverMessage) res.setHeader('Cache-Control', 'no-cache, no-store');
		req.session.serverMessage = null;
		res.render('index', viewContext);
	});
};

//note: the recaptcha commented code is for quicker debugging!
exports.add = (req, res) => {
	recaptcha.validateRequest(req)
	.then(function(){
		
		// validated and secure
		const isSpam = null;
		const isUnprocessed = true;
		model.addHackathon(req.body, isSpam, isUnprocessed)
		.then( (hackathon) => {
			req.session.serverMessage = "Hackathon " + hackathon.id + " gehouden in " + hackathon.location.city + " is toegevoegd!";
			
			//you need to eventually redirect on the fly but not for now.
			res.redirect('/');

			
		});
	})
	.catch(function(errorCodes){
		// invalid
		console.log('\n\n__INVALID RECAPTCHA__\n');
		console.log(recaptcha.translateErrors(errorCodes));// translate error codes to human readable text
		res.redirect('/');
	});

}


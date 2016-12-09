const model = require('../models/sequelize_db.js');
reCAPTCHA=require('recaptcha2')
const moment = require('moment');

//TO DO: put in config file
recaptcha=new reCAPTCHA({
  siteKey:'6Lc4Gw4UAAAAAIANaqNWbLvalhbp_ORdREPBznej',
  secretKey:'6Lc4Gw4UAAAAAEOBaiXyh9SaEvv9ZKOyKRz0fsiY'
});

exports.root = (req, res) => {
	model.getRealHackathons()
	.then( (hackathons) => {
		for (let hackathon of hackathons){
			let startDate = moment(hackathon.start_date).locale('nl').format('D');
			let startDay = moment(hackathon.start_date).locale('nl').format('dd');
			let startMonth = moment(hackathon.start_date).locale('nl').format('MMMM');
			let startYear = moment(hackathon.start_date).locale('nl').format('YY');
			let endDate = moment(hackathon.end_date).locale('nl').format('D');
			let endDay = moment(hackathon.end_date).locale('nl').format('dd');
			let endMonth = moment(hackathon.end_date).locale('nl').format('MMMM');
			let endYear = moment(hackathon.end_date).locale('nl').format('YY');
			
			let monthRenderString = startMonth;
			let dayRenderString = startDay + ' - ' + endDay;
			let dateRenderString = startDate + ' - ' + endDate;
			
			if (startMonth!==endMonth){
				startMonth = moment(hackathon.start_date).locale('nl').format('MMM');
				endMonth = moment(hackathon.end_date).locale('nl').format('MMM');
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
		};	
		res.render('index', viewContext);
	});
};

exports.add = (req, res) => {
	recaptcha.validateRequest(req)
	.then(function(){
		// validated and secure
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
		const isSpam = null;
		const isUnprocessed = true;
		model.addHackathon(hackathon, location, isSpam, isUnprocessed)
		.then( (result) => {
			
			res.send(result);
		});
	})
	.catch(function(errorCodes){
		// invalid
		console.log('\n\n__INVALID RECAPTCHA__\n');
		console.log(recaptcha.translateErrors(errorCodes));// translate error codes to human readable text
		res.redirect('/');
	});

}


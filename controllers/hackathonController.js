const model = require('../models/sequelize_db.js');
reCAPTCHA=require('recaptcha2')
 
//TO DO: put in config file
recaptcha=new reCAPTCHA({
  siteKey:'6Lc4Gw4UAAAAAIANaqNWbLvalhbp_ORdREPBznej',
  secretKey:'6Lc4Gw4UAAAAAEOBaiXyh9SaEvv9ZKOyKRz0fsiY'
});

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
		console.log('\n\n__INVALED RECAPTCHA__\n');
		console.log(recaptcha.translateErrors(errorCodes));// translate error codes to human readable text
		res.redirect('/');
	});

	
}


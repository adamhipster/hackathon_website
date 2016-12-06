const model = require('../models/sequelize_db.js');

exports.root = (req, res) => {
	res.send('ok');
};

exports.add = (req, res) => {
	const b = req.body;
	const hackathon = {
		name: b.name,
		topic: b.topic,
		start_date: b.start_date,
		end_date: b.end_date,
		url: "sns.nl",
	};
	const location = {
		city: b.city,
		address_name: b.address_name,
		address_number: b.address_number,
	}
	model.addHackathon(hackathon, location)
	.then( (result) => {
		res.send(result);
	});
}




/* 	SEND EMAIL FUNCTIONS, OAUTH DOESN'T FULLY WORK YET
	Keep these functions around.
*/
const nodemailer = require('nodemailer');
const generator = require('xoauth2').createXOAuth2Generator({
    user: 'user@gmail.com',
    clientId: '',
    clientSecret: '',
    refreshToken: '',
    accessToken: '',
});

//go to: https://developers.google.com/oauthplayground

generator.on('token', function(token){
    console.log('New token for %s: %s', token.user, token.accessToken);
});

function sendEmailOauth(opts) {
	const transporter = nodemailer.createTransport(({
	    service: 'gmail',
	    auth: {
	        xoauth2: generator
	    }
	}));
	const mailOptions = {
		from: 'user@gmail.com', 
		to: 'user@gmail.com', 
		subject: 'Hackathon', 
		html: '<b>Hello world ✔</b>'
	};

	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
		}
		else{
			console.log('Message sent: ' + info.response);
		};
	});
}




function sendEmail(opts) {
	const transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'user@gmail.com', 
			pass: 'password' 
		}
	});

	const mailOptions = {
		from: 'user@gmail.com>', 
		to: 'user@gmail.com', 
		subject: 'Hackathon', 
		html: '<b>Hello world ✔</b>'
	};

	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
		}
		else{
			console.log('Message sent: ' + info.response);
		};
	});
}


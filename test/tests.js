const supertest = require("supertest");
const should = require('chai').should();
const expect = require('chai').expect;
const assert = require('chai').assert;
const server = supertest('http://localhost:8080');
const model = require('../models/sequelize_db');

//Bedenk dat je nog een beforeEach hebt en een before

describe("GET /", function(){
	it('should return a 200 response', function(done){
		server.get('/')
		.set('Accept', 'text/html')
		.expect(200, done);
	});
});

describe("GET /admin/dashboard", function(){
	it('should return a 200 response', function(done){
		server.get('/admin/dashboard')
		.set('Accept', 'text/html')
		.expect(200, done);
	});
});


describe("POST /hackathon/add", function(){
	it('Should be able to post a hackathon to the database', function(done){
		const formData = {
			name: "SNS Hack",
			topic: "Fintech",
			start_date: new Date(),
			end_date: new Date(2016, 11, 30),
			url: "sns.nl",
			city: "Amsterdam",
			address_name: "Bruinvisstraat",
			address_number: 255,
		};
		server.post('/hackathon/add')
		.send(formData)
		.end( (err, result) => {
			if (err) done(err);
			model.getAllHackathons()
			.then( (hackathon) => {
				assert.equal(hackathon[0].name, "SNS Hack");
				done();
			});
		});
	});
})





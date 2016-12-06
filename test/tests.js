const supertest = require("supertest");
const should = require('chai').should();
const expect = require('chai').expect;
const assert = require('chai').assert;
const server = supertest('http://localhost:8080');
const model = require('../models/sequelize_db');

//Bedenk dat je nog een beforeEach hebt en een before

describe("Workaround for waiting for db sync", function(){
	it('Should wait for 500 ms and reset the test database', function(done){
		setTimeout(function(){ 
			model.db.sync({force: true});
			done(); 
		}, 500);
	});
});

describe("GET /", function(){

	it('should return a 200 response', function(done){
		server.get('/')
		.set('Accept', 'text/html')
		.expect(200, done);
	});
});

function getDashboard(hackathonName){
	describe("GET /admin/dashboard", function(){
		it('should return a 200 response and assert if HackathonName {' +hackathonName
			+ '} is equal to the empty string or the name of the first item in the database.', function(done){
			server.get('/admin/dashboard')
			.set('Accept', 'text/html')
			.expect(200)
			.end( (err, result) => {
				if(err) done(err);
				model.getUnprocessedHackathons()
				.then( (hackathons) => {
					assert.equal( (hackathons[0]?hackathons[0].name:""), hackathonName);
					done();
				});	
			});
		});
	});
}

getDashboard("");


describe("POST /addHackathon", function(){
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
		server.post('/addHackathon')
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

getDashboard("SNS Hack");

//implicitly tested: GET /admin/processHackathon/:id
//won't be added to tests
describe("Prep work: update unprocessed: false for the first hackathon", function(){
	before(function(done){
		const id = 1;
		const isRealEvent = true;
		model.setSpamAttrForHackathonById(id, isRealEvent)
		.then( () => { 
			done(); 
		});
	});

	getDashboard("");
})

describe("GET /deleteHackathon/:id", function(){
	it('Should give one hackathon back when queried for all hackathons', function(done){
		model.getAllHackathons()
		.then( (hackathon) => {
			assert.equal(hackathon[0].name, "SNS Hack");
			done();
		});
	});

	it("Should give no hackathons back since delete is evoked in the before hook", function(done){
		const id = 1;
		server.get('/admin/deleteHackathon/'+id)
		.end( (err, result) => {
			if(err) done(err);
			model.getAllHackathons()
			.then( (hackathon) => {
				assert.equal(hackathon, "");
				done();
			});
		});
	})
});






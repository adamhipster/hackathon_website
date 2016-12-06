const supertest = require("supertest");
const should = require('chai').should();
const expect = require('chai').expect;
const server = supertest('http://localhost:8080');

const Sequelize = require('sequelize')
const db = new Sequelize('hackathonsapptest', 'melvin', '', {
	dialect: 'postgres',
});

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


descrite("POST /hackathon/add", function(){
	it('Should be able to post a hackathon to the database', function(done){
		server.post('/hackathon/add')
		//todo
	});
})







// var expect = require('expect.js');

// describe('models/task', function () {
//   before(function () {
//       return require('../../models').sequelize.sync();
//   });

//   beforeEach(function () {
//     this.User = require('../../models').User;
//     this.Task = require('../../models').Task;
//   });

//   describe('create', function () {
//     it('creates a task', function () {
//       return this.User.create({ username: 'johndoe' }).bind(this).then(function (user) {
//         return this.Task.create({ title: 'a title', UserId: user.id }).then(function (task) {
//           expect(task.title).to.equal('a title');
//         });
//       });
//     });
//   });
// });
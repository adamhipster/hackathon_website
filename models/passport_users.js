const Strategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');

//var hash = bcrypt.hashSync('password', 10);
const records = [
    { 
      id: 1, username: 'mella', password: '$2a$10$77g4G0a3kj6FJsxRC8VgdOX/0IQduK9p7SDcPcasC7C.2thjhW/EO'
    }
];

exports.init = function(){

  passport.use(new Strategy(
    function(username, password, cb) {
        findByUsername(username, function(err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (!bcrypt.compareSync(password, user.password) ) { return cb(null, false); }

            return cb(null, user);
        });
    }));

  passport.serializeUser(function(user, cb) {
      cb(null, user.id);
  });

  passport.deserializeUser(function(id, cb) {
      findById(id, function (err, user) {
          if (err) { return cb(err); }
          cb(null, user);
      });
  });

}

function findById(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

function findByUsername(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
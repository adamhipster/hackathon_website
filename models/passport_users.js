//var hash = bcrypt.hashSync('password', 10);
var records = [
    { id: 1, username: 'mella', password: '$2a$10$77g4G0a3kj6FJsxRC8VgdOX/0IQduK9p7SDcPcasC7C.2thjhW/EO'}
    // { id: 1, username: 'mella', password: 'paard'}
];

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {
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
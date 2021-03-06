var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');



var User = mongoose.model('User', db.usersSchema);

// User.initialize = function() {
//   console.log('1');
//   this.on('creating', this.hashPassword);
// };

User.comparePassword = function(attemptedPassword, password, callback) {
  bcrypt.compare(attemptedPassword, password, function(err, isMatch) {
    console.log('the ISMATCH=================', isMatch);
    if (err) {
      console.log('bcrypterror=========', err);
    } else {  
      callback(isMatch);
    }
  });
};

User.hashPassword = function(password) {
  var cipher = Promise.promisify(bcrypt.hash);
  cipher(password, null, null).bind(this)
    .then(function(hash) {
      return hash;
    });
};

module.exports = User;





// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function() {
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

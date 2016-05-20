var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

// db.urlsSchema.methods.initialize = function() {
//   this.on('creating', function(model, attrs, options) {
//     var shasum = crypto.createHash('sha1');
//     shasum.update(model.get('url'));
//     model.set('code', shasum.digest('hex').slice(0, 5));
//   });
// };

var Link = mongoose.model('Link', db.urlsSchema);

// Link.createBitly = function(model, callback) {
//   var shasum = crypto.createHash('sha1');
//   shasum.update(model.url);
//   callback(shasum.digest('hex').slice(0, 5));
// };



module.exports = Link;

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });



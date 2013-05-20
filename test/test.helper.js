global.assert = require('chai').assert;
global.mongoURL = 'mongodb://127.0.0.1/mongoose_friendly_test';
global.mongoose = require('mongoose');
mongoose.connect(mongoURL, function(error) {
  if (!error) return;
  console.error(error, 'You need to have mongodb running in order to run all tests.');
  process.exit(1);
});

global.cleanup = function(done) {
  var current = 0;
  var total = Object.keys(mongoose.connection.collections).length;
  if (total === current) done();
  for(collection in mongoose.connection.collections) {
    mongoose.connection.collections[collection].drop(function() { if (total === ++current) done(); });
  }
};
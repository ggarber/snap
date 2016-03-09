var assert = require('assert'),
    http = require('../lib/http-client.js'),
    stats = require('../lib/stats.js'),
    logging = require('../lib/logging.js');

describe('Request', function() {
  it('maintain request parameters in the callback', function(done) {
    var request = http({ name: 'google', logging: false });
    request('http://www.google.com', function(err, res, body) {
      assert(!err && res && body);

      done();
    });
  });

  it('should measure stats for requests', function(done) {
    var request = http({ name: 'google0', logging: false });
    request('http://www.google.com', function() {
      var stat = stats.stats()['google0'];
      assert.equal(stat.count, 1);
      assert(stat.delay > 50);

      done();
    });
  });

  it('should generate logs for requests', function(done) {
    var logged = false;
    logging.getLogger('google1').info = function() {
      logged = true;
    };
    var request = http('google1');
    request('http://www.google.com', function() {
      assert(logged);

      done();
    });
  });

  it('wrap request.get method', function(done) {
    var request = http({ name: 'google2', logging: false });
    request.get({ url: 'http://www.google.com' }, function(err, res, body) {
      var stat = stats.stats()['google2'];
      assert.equal(stat.count, 1);

      done();
    });
  });

  it('wrap request.post method', function(done) {
    var request = http({ name: 'google3', logging: false });
    request.post({ url: 'http://www.google.com' }, function(err, res, body) {
      var stat = stats.stats()['google3'];
      assert.equal(stat.count, 1);

      done();
    });
  });
});

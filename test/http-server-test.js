var assert = require('assert'),
    http = require('../lib/http-server.js'),
    stats = require('../lib/stats.js'),
    logging = require('../lib/logging.js');

describe('Server Filter', function() {
  it('should measure stats', function(done) {
	function on(event, callback) {
	  callback();
	}
    var filter = http.filter({ name: 'server', logging: false });
    filter({}, { on: on }, function() {
	    assert.equal(stats.stats()['server'].count, 1);
      done();
    });
  });

  it('should generate logs for requests', function(done) {
    var logged = false;
    logging.getLogger('server1').info = function() {
      logged = true;
    };
	function on(event, callback) {
	  callback();
	}
    var filter = http.filter('server1');
    filter({}, { on: on }, function() {
	    assert(logged);
      done();
    });
  });

});

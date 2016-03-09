var assert = require('assert'),
    stats = require('../lib/stats.js');

describe('Stats', function() {
  it('should calculate delays', function(done) {
    function task(callback) {
      setTimeout(function() {
        callback(null);
      }, 100);
    }

    var trackedTask = stats.track('test0', task);
    trackedTask(function() {
      var stat = stats.stats()['test0'];

      assert.equal(stat['count'], 1);
      assert.equal(stat['success'], 1);
      assert(!stat['failure']);
      assert(stat['delay'] > 50);

      done();
    });
  });

  it('should count failures', function(done) {
    function task(callback) {
      callback(new Error(''));
    }

    var trackedTask = stats.track('test1', task);
    trackedTask(function() {
      var stat = stats.stats()['test1'];

      assert.equal(stat['count'], 1);
      assert.equal(stat['failure'], 1);
      assert(!stat['success']);
      assert(stat['delay'] < 50);

      done();
    });
  });

  it('should maintain counts', function(done) {
    function task(callback) {
      callback(null);
    }

    var trackedTask = stats.track('test2', task);
    trackedTask(function() { });
    trackedTask(function() {
      var stat = stats.stats()['test2'];

      assert.equal(stat['count'], 2);
      assert.equal(stat['success'], 2);

      done();
    });
  });
});

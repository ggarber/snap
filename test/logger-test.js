var assert = require('assert'),
    logging = require('../lib/logging.js'),
    stdout = require('test-console').stdout;

function shouldShow(logger, fnName, shown) {
  var output = stdout.inspectSync(function() {
    logger[fnName]('test');
  });
  var expectedLength = 1;
  if (shown === false) {
    expectedLength = 0;
  }
  assert.deepEqual(output.length, expectedLength);
};

function shouldNotShow(logger, fnName) {
  shouldShow(logger, fnName, false);
};

describe('Logging', function() {
  afterEach(function() {
    process.env.NODE_ENV = '';
    process.env.NODE_LOG_LEVEL = '';
  });

  describe('NODE_ENV', function() {
    describe('debug', function() {
      var logger;
      beforeEach(function() {
        process.env.NODE_ENV = 'debug';
        logger = logging.getLogger('NODE_ENV - debug')
      })
      it('should show on debug', function() {
        shouldShow(logger, 'debug');
      });
      it('should show on info', function() {
        shouldShow(logger, 'info');
      });
      it('should show on warn', function() {
        shouldShow(logger, 'warn');
      });
      it('should show on error', function() {
        shouldShow(logger, 'error');
      });
    });

    describe('prepro', function() {
      var logger;
      beforeEach(function() {
        process.env.NODE_ENV = 'prepro';
        logger = logging.getLogger('NODE_ENV - prepro')
      })
      it('should NOT show on debug', function() {
        shouldNotShow(logger, 'debug');
      });
      it('should show on info', function() {
        shouldShow(logger, 'info');
      });
      it('should show on warn', function() {
        shouldShow(logger, 'warn');
      });
      it('should show on error', function() {
        shouldShow(logger, 'error');
      });
    });

    describe('production', function() {
      var logger;
      beforeEach(function() {
        process.env.NODE_ENV = 'production';
        logger = logging.getLogger('NODE_ENV - production')
      })
      it('should NOT show on debug', function() {
        shouldNotShow(logger, 'debug');
      });
      it('should show on info', function() {
        shouldShow(logger, 'info');
      });
      it('should show on warn', function() {
        shouldShow(logger, 'warn');
      });
      it('should show on error', function() {
        shouldShow(logger, 'error');
      });
    });

    describe('test', function() {
      var logger;
      beforeEach(function() {
        process.env.NODE_ENV = 'test';
        logger = logging.getLogger('NODE_ENV - test')
      })
      it('should NOT show on debug', function() {
        shouldNotShow(logger, 'debug');
      });
      it('should NOT show on info', function() {
        shouldNotShow(logger, 'info');
      });
      it('should show on warn', function() {
        shouldShow(logger, 'warn');
      });
      it('should show on error', function() {
        shouldShow(logger, 'error');
      });
    });
  });

  describe('NODE_LOG_LEVEL', function() {
    describe('debug', function() {
      var logger;
      beforeEach(function() {
        process.env.NODE_LOG_LEVEL = 'debug';
        logger = logging.getLogger('NODE_LOG_LEVEL - debug')
      })
      it('should show on debug', function() {
        shouldShow(logger, 'debug');
      });
      it('should show on info', function() {
        shouldShow(logger, 'info');
      });
      it('should show on warn', function() {
        shouldShow(logger, 'warn');
      });
      it('should show on error', function() {
        shouldShow(logger, 'error');
      });
    });

    describe('info', function() {
      var logger;
      beforeEach(function() {
        process.env.NODE_LOG_LEVEL = 'info';
        logger = logging.getLogger('NODE_LOG_LEVEL - info')
      })
      it('should NOT show on debug', function() {
        shouldNotShow(logger, 'debug');
      });
      it('should show on info', function() {
        shouldShow(logger, 'info');
      });
      it('should show on warn', function() {
        shouldShow(logger, 'warn');
      });
      it('should show on error', function() {
        shouldShow(logger, 'error');
      });
    });
  });

  describe('mixing NODE_ENV and NODE_LOG_LEVEL, NODE_LOG_LEVEL must win', function() {
    describe('when NODE_ENV shows LESS logs than NODE_LOG_LEVEL', function() {
      var logger;
      beforeEach(function() {
        process.env.NODE_ENV = 'production'; // this should disable 'debug' output
        process.env.NODE_LOG_LEVEL = 'debug';
        logger = logging.getLogger('mixing production with debug')
      })
      it('should show on debug', function() {
        shouldShow(logger, 'debug');
      });
      it('should show on info', function() {
        shouldShow(logger, 'info');
      });
      it('should show on warn', function() {
        shouldShow(logger, 'warn');
      });
      it('should show on error', function() {
        shouldShow(logger, 'error');
      });
    });

    describe('when NODE_ENV shows MORE logs than NODE_LOG_LEVEL', function() {
      var logger;
      beforeEach(function() {
        process.env.NODE_ENV = 'production'; // this should disable 'debug' output, but enable 'info'
        process.env.NODE_LOG_LEVEL = 'warn'; // this should disable 'info' output
        logger = logging.getLogger('mixing production with debug')
      })
      it('should NOT show on debug', function() {
        shouldNotShow(logger, 'debug');
      });
      it('should NOT show on info', function() {
        shouldNotShow(logger, 'info');
      });
      it('should show on warn', function() {
        shouldShow(logger, 'warn');
      });
      it('should show on error', function() {
        shouldShow(logger, 'error');
      });
    });
  });
});

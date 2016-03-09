var log4js = require('log4js'),
    assert = require('assert'),
    uuid = require('uuid');

var env, logLevel;

function setLogLevelForLogger(logger) {
  env = process.env.NODE_ENV;
  logLevel = process.env.NODE_LOG_LEVEL;
  if (logLevel) {
    setLogLevelBasedOnSpecificLevel(logger);
  } else {
    setLogLevelBasedOnEnv(logger);
  }
}

function setLogLevelBasedOnEnv(logger) {
  switch (env && env.toLowerCase()) {
    case 'debug':
      logger.setLevel(log4js.levels.DEBUG)
      break;
    case 'test':
      logger.setLevel(log4js.levels.WARN)
      break;
    case 'prepro':
      logger.setLevel(log4js.levels.INFO)
      break;
    case 'production':
      logger.setLevel(log4js.levels.INFO)
      break;
    default:
      logger.setLevel(log4js.levels.DEBUG)
  }
}

function setLogLevelBasedOnSpecificLevel(logger) {
  var log4jsLevel = log4js.levels[logLevel.toUpperCase()];
  if (log4jsLevel) {
    logger.setLevel(log4jsLevel);
  }
}

function format(action, params) {
  var str = '';
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
        if (str.length) str += ", ";
        str += key + ": " + params[key];
    }
  }

  return action + ": " + str;
}

function track(name, action, fn) {
  var logger = log4js.getLogger(name),
      id = uuid.v4();
  return function() {
    logger.info(format(action + 'Begin', { id: id }));

    var callback = arguments[arguments.length - 1];

    assert(typeof(callback) === 'function');

    arguments[arguments.length - 1] = function(err) {
      logger.info(format(action + 'End', { id: id }));

      callback.apply(this, arguments);
    };
    fn.apply(this, arguments);
  };
}

function getLogger() {
  var logger = log4js.getLogger.apply(undefined, arguments);
  setLogLevelForLogger(logger);
  return logger;
}

exports.getLogger = getLogger;
exports.track = track;
exports.format = format;

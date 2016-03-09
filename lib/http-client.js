var request = require('request'),
    stats = require('./stats.js'),
    logging = require('./logging.js');

var ACTION = 'HttpClient';

function wrap(settings, fn) {
  var name = typeof settings == 'object' ? settings.name : settings,
      loggingEnabled = settings.logging === false ? false : true,
      statsEnabled = settings.stats === false ? false : true;

  if (statsEnabled) fn = stats.track(name, fn);
  if (loggingEnabled) fn = logging.track(name, ACTION, fn);

  return fn;
};

module.exports = function(settings) {
  // TODO(ggb): Log parentId coming from clients to create a hierarchy of logs for
  // tracking/debugging pourpuses

  var obj = wrap(settings, request);

  obj.get = wrap(settings, request.get);
  obj.post = wrap(settings, request.post);
  obj.put = wrap(settings, request.put);
  obj.del = wrap(settings, request.del);

  return obj;
};

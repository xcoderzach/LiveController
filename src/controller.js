


function zip(keys, values) {
  var zipped = {}
  for (var i = 0; i < keys.length; i++) {
    zipped[keys[i]] = values[i]
  }
  return zipped
}

function merge(obj1, obj2) {
  var i
  for(i in obj2) {
    if(obj2.hasOwnProperty(i)) {
      obj1[i] = obj2[i]
    }
  }
}

var Controller
(function() {

var routes = {}
  , routeMethods = ["get", "post", "put", "delete"]

Controller = function(base, scope) {
  var router = {}
    , that = this
  this.base = base
  routeMethods.forEach(function(method) {
    routes[method] = []
    router[method] = function(route, callback) {
      that.registerRoute(method, route, callback) 
    }
  })
  scope(router)
}

Controller.prototype.registerRoute = function(method, route, callback) {
  var keys = []

  if(typeof route !== "string") {
    callback = route
    route = ""
  }

  routes[method].push({
    "regex": normalizePath(this.base + route, keys)
  , "keys": keys
  , "original": this.base + route
  , "callback": callback  
  })
}

function matchRoute(method, url, params) {
  params = params || {}
  routes[method].forEach(function(obj) {
    var matches = url.match(obj.regex)

    if(matches) {
      merge(params, zip(obj.keys, matches.slice(1)))
      obj.callback(params)
    }
  })
}
   
Controller.get = function(url) {
  matchRoute("get", url)
}

Controller.post = function(url, params) {
  matchRoute("post", url, params)
} 
 /**
  * from: https://github.com/senchalabs/connect/blob/master/lib/middleware/router.js
  */
function normalizePath(path, keys) {
  path = path
    .concat('/?')
    .replace(/\/\(/g, '(?:/')
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
      keys.push(key);
      slash = slash || '';
      return ''
        + (optional ? '' : slash)
        + '(?:'
        + (optional ? slash : '')
        + (format || '') + (capture || '([^/]+?)') + ')'
        + (optional || '');
    })
    .replace(/([\/.])/g, '\\$1')
    .replace(/\*/g, '(.+)');
  return new RegExp('^' + path + '$', 'i');
}

}()) 

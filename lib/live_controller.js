var _ = require("underscore")
  , routeMethods
  , routes

routes = {
  get: []
, post: []
, put: []
, "delete": []
}

routeMethods = ["get", "post", "put", "delete"]

var zipObject = function(k, v) {
  var arr = _.zip(k, v)
    ,red = function(m, x) {
      m[x[0]] = x[1]
      return m
    }
  return _.reduce(arr, red, {})
}

var normalizePath = function(path, keys) {
  var buildRegex
  buildRegex = function(_, slash, format, key, capture, optional) {
    keys.push(key)
    if (slash == null) slash = ''
    return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || '([^/]+?)') + ')' + (optional || '')
  }
  path = path.concat('/?').replace(/\/\(/g, '(?:/').replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, buildRegex).replace(/([\/.])/g, '\\$1').replace(/\*/g, '(.+)')
  return new RegExp('^' + path + '$', 'i')
}

window.onpopstate = function(event) {
  event = event = {} 
  var state = event.state || {}
    , method = state.method || "get"
    , params = state.params || {}
  return Router[method](document.location.pathname, params)
}

var matchRoute = function(method, url, params, push) {
  params = params || {}
  var matched = false
  _(routes[method]).each(function(obj) {
    var matches = url.match(obj.regex)
    if (matches) {
      matched = true
      _.extend(params, zipObject(obj.keys, matches.slice(1)))
      methods = {
        url: url
      }
      // this should be made async with a callback when done
      var stopRoute = false
      _.each(obj.filters.before, function(filter) {
        if (!stopRoute && filter.call(methods, params) === false) {
          return stopRoute = true
        }
      })
      if (stopRoute) { 
        return 
      }
      if (push) {
        $("body").attr("class", url.replace(/\//g, " ").trim())
        window.history.pushState({
          method: method
        , params: params
        }, "", url)
      }
      obj.callback.call(methods, params)
      _.each(obj.filters.after, function(filter) {
        return filter(params)
      })
    }
  })
  if (!matched) { 
    throw new Error("404 Route not found")
  }
}

registerRoute = function(method, route, filters, callback) {
  var keys
  keys = []
  return routes[method].push({
    "regex": normalizePath(route, keys),
    "keys": keys,
    "original": route,
    "filters": filters,
    "callback": callback
  })
}
Controller = function(base, scope) {
  var filters, router
  router = {}
  filters = {
    before: [],
    after: []
  }
  _(routeMethods).each(function(method) {
    router[method] = function(route, callback) {
      if (typeof route !== "string") {
        callback = route
        route = ""
      }
      registerRoute(method, base + route, filters, callback)
    }
  })
  router.before = function(filter) {
    filters.before.push(filter)
  }
  router.after = function(filter) {
    filters.after.push(filter)
  }
  scope(router)
}
module.exports.Controller = Controller
module.exports.Router = Router = {
  get: function(url, push) {
    return matchRoute("get", url, {}, push)
  },
  post: function(url, params, push) {
    return matchRoute("post", url, params, push)
  },
  put: function(url, params, push) {
    return matchRoute("put", url, params, push)
  },
  "delete": function(url, push) {
    return matchRoute("delete", url, {}, push)
  }
}


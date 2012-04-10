var _ = require("underscore")
  , routeMethods
  , routes = []

routeMethods = []

$("a").live("click", function(e) {
  var url = $(this).attr("href")
  try {
    navigate(url)
    //prevent the default if router doesnt throw a 404 exception
    e.preventDefault()
  } catch(e) {
    //just swallow the 404 and do the regular link action
  }
})

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
  return navigate(document.location.pathname)
}

var matchRoute = function(url, push) {
  var matched = false
  _(routes).each(function(obj) {
    var matches = url.match(obj.regex)
      , params
    if (matches) {
      matched = true
      params = zipObject(obj.keys, matches.slice(1))
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
        //$("body").attr("class", url.replace(/\//g, " ").trim())
        window.history.pushState({}, "", url)
      }
      obj.callback.call(methods, params)
      _.each(obj.filters.after, function(filter) {
        return filter(params)
      })
    }
  })
  if (!matched) { 
    throw new Error(url + "404 Route not found")
  }
}

registerRoute = function(route, filters, callback) {
  var keys
  keys = []
  return routes.push({
    "regex": normalizePath(route, keys),
    "keys": keys,
    "original": route,
    "filters": filters,
    "callback": callback
  })
}
var Controller = function(base, scope) {
  var filters, router
  router = {}
  filters = {
    before: [],
    after: []
  }
  router = function(route, callback) {
    if (typeof route !== "string") {
      callback = route
      route = ""
    }
    registerRoute(base + route, filters, callback)
    return this
  }
  router.get = router
  router.before = function(filter) {
    filters.before.push(filter)
    return this
  }
  router.after = function(filter) {
    filters.after.push(filter)
    return this
  }
  scope(router)
  return { get: router, before: router.before, after: router.after }
}
module.exports.Controller = Controller
var navigate = module.exports.navigate = function(url, opts) {
  opts = opts || {}
  var method = opts.method || "push"
  if(method === "reload") {
    document.location = url
  } else {
    return matchRoute(url, {}, opts.push)
  }
}

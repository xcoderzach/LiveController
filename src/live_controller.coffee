zipObject = (k, v) ->
  arr = _.zip(k, v)
  red = (m, x)-> 
    m[x[0]] = x[1]
    return m
  _.reduce(arr, red, {})

merge = _.extend

# from: https://github.com/senchalabs/connect/blob/master/lib/middleware/router.js


normalizePath = (path, keys) ->

  buildRegex  = (_, slash, format, key, capture, optional) ->
    keys.push(key)
    slash ?= ''
    return '' +
      (if optional then '' else slash) +
      '(?:' +
      (if optional then slash else '') +
      (format || '') + (capture || '([^/]+?)') + ')' +
      (optional || '')

  path = path.concat('/?')
             .replace(/\/\(/g, '(?:/')
             .replace( /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, buildRegex)
             .replace(/([\/.])/g, '\\$1')
             .replace(/\*/g, '(.+)');
  return new RegExp('^' + path + '$', 'i');

routes = {}
routeMethods = ["get", "post", "put", "delete"]

matchRoute = (method, url, params, push) ->
  params ?= {}

  for i in [0...routes[method].length]
    obj = routes[method][i]
    matches = url.match obj.regex

    if matches
      merge params, zipObject(obj.keys, matches.slice(1))

      stopRoute = false
      _.each obj.filters.before, (filter) ->
        if !stopRoute && filter(params) == false
          stopRoute = true
      if stopRoute
        return
      
      obj.callback params

      _.each obj.filters.after, (filter) ->
        filter(params)

      if push
        window.history.pushState { method: method, params: params }, "", url
      return

registerRoute = (method, route, filters, callback) ->
  keys = []
  routes[method].push { "regex": normalizePath(route, keys)
                      , "keys": keys
                      , "original": route
                      , "filters": filters
                      , "callback": callback }

class Controller
  constructor: (base, scope) ->
    router = {}
    filters = {before:[], after:[]}
    routeMethods.forEach (method) ->
      routes[method] = []
      router[method] = (route, callback) ->
        if typeof route != "string"
          callback = route
          route = "" 
        registerRoute method, base + route, filters, callback
        
    router.before = (filter) ->
      filters.before.push filter

    router.after = (filter) ->
      filters.after.push filter

    scope router

    window.onPopState = (event) ->
      params = event.state.params
      method = event.state.method
      url = document.location.pathname

      if method == "get" || method == "delete"
        this[method](url, false)

      if method == "put" || method == "post" 
        this[method](url, params, false)

window.Controller = Controller
window.Router = {
  get: (url, push) ->
    matchRoute("get", url, push)

  post: (url, params, push) ->
    matchRoute("post", url, params, push)

  put: (url, params, push) ->
    matchRoute("put", url, params, push)

  delete: (url, push) ->
    matchRoute("delete", url, push)
}

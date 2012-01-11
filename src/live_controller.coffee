routes =
  get: []
  post: []
  put: []
  delete: []
  
routeMethods = ["get", "post", "put", "delete"]

define ["jquery", "underscore"], ($, _) ->

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
               .replace(/\*/g, '(.+)')
    return new RegExp('^' + path + '$', 'i')

  window.onpopstate = (event) ->
    event ?= {}
    state = event.state || {}
    method = state.method || "get"
    params = state.params || {}
    Router[method](document.location.pathname, params)

  matchRoute = (method, url, params, push) ->
    params ?= {}

    for i in [0...routes[method].length]
      obj = routes[method][i]
      matches = url.match obj.regex
      if matches
        merge params, zipObject(obj.keys, matches.slice(1))
        methods =
          url: url
        
        stopRoute = false
        _.each obj.filters.before, (filter) ->
          if !stopRoute && filter.call(methods, params) == false
            stopRoute = true
        if stopRoute
          return

        if push
          $("body").attr("class", url.replace(/\//g, " ").trim())
          window.history.pushState { method: method, params: params }, "", url

        obj.callback.call methods, params

        _.each obj.filters.after, (filter) ->
          filter(params)

  registerRoute = (method, route, filters, callback) ->
    keys = []
    routes[method].push { "regex": normalizePath(route, keys)
                        , "keys": keys
                        , "original": route
                        , "filters": filters
                        , "callback": callback }

  Controller = (base, scope) ->
      
    router = {}
    filters = {before:[], after:[]}
    routeMethods.forEach (method) ->

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


  exports = {}
  exports.Controller = Controller
  exports.Router = Router =
    get: (url, push) ->
      matchRoute("get", url, {}, push)

    post: (url, params, push) ->
      matchRoute("post", url, params, push)

    put: (url, params, push) ->
      matchRoute("put", url, params, push)

    delete: (url, push) ->
      matchRoute("delete", url, {}, push)

  return exports

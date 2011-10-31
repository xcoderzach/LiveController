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


getHelper = (url) ->
  helperClassName = url.replace /^[a-zA-Z]|\/[a-zA-Z]/g, (x) -> x.toUpperCase()
  helperClassName = helperClassName.replace(/\//g, "")+ "Helper"
  return window[helperClassName]

window.onpopstate = (event) ->
  console.log("derp")
  event ?= {}
  state = event.state || {}
  method = state.method || "get"
  params = state.params || {}
  Router[method](document.location.pathname, params) 


routes = {}
routeMethods = ["get", "post", "put", "delete"]

matchRoute = (method, url, params, push) ->
  params ?= {}

  for i in [0...routes[method].length]
    obj = routes[method][i]
    matches = url.match obj.regex

    if matches

      new LiveView "/views" + url + ".html", {}, (view) -> 
        ctor = getHelper url
        if ctor?
          helper = new ctor(view)
        else 
          helper = () ->
        merge params, zipObject(obj.keys, matches.slice(1))
        methods = { 
                    url: url,
                    view: view, 
                    autoRender: true
                    helper: helper
                  }
        
        stopRoute = false
        _.each obj.filters.before, (filter) ->
          if !stopRoute && filter.call(methods, params) == false
            stopRoute = true
        if stopRoute
          return

        obj.callback.call methods, params 

        _.each obj.filters.after, (filter) ->
          filter(params)

        if push
          $("body").attr("class", url.replace(/\//g, " ").trim())
          window.history.pushState { method: method, params: params }, "", url
        if(methods.autoRender)
          $("#main").html(methods.view.context)
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
    matchRoute("get", url, {}, push)

  post: (url, params, push) ->
    matchRoute("post", url, params, push)

  put: (url, params, push) ->
    matchRoute("put", url, params, push)

  delete: (url, push) ->
    matchRoute("delete", url, {}, push)
}

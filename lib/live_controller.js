(function() {
  var Controller, filters, matchRoute, merge, normalizePath, registerRoute, routeMethods, routes, zipObject;
  zipObject = function(k, v) {
    var arr, red;
    arr = _.zip(k, v);
    red = function(m, x) {
      m[x[0]] = x[1];
      return m;
    };
    return _.reduce(arr, red, {});
  };
  merge = _.extend;
  normalizePath = function(path, keys) {
    var buildRegex;
    buildRegex = function(_, slash, format, key, capture, optional) {
      keys.push(key);
      if (slash == null) {
        slash = '';
      }
      return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || '([^/]+?)') + ')' + (optional || '');
    };
    path = path.concat('/?').replace(/\/\(/g, '(?:/').replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, buildRegex).replace(/([\/.])/g, '\\$1').replace(/\*/g, '(.+)');
    return new RegExp('^' + path + '$', 'i');
  };
  routes = {};
  filters = {
    before: []
  };
  routeMethods = ["get", "post", "put", "delete"];
  matchRoute = function(method, url, params, push) {
    var i, matches, obj, _ref;
    if (params == null) {
      params = {};
    }
    for (i = 0, _ref = routes[method].length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      obj = routes[method][i];
      matches = url.match(obj.regex);
      if (matches) {
        merge(params, zipObject(obj.keys, matches.slice(1)));
        _.each(filters["before"], function(filter) {
          return filter();
        });
        obj.callback(params);
        if (push) {
          window.history.pushState({
            method: method,
            params: params
          }, "", url);
        }
        return;
      }
    }
  };
  registerRoute = function(method, route, callback) {
    var keys;
    keys = [];
    return routes[method].push({
      "regex": normalizePath(route, keys),
      "keys": keys,
      "original": route,
      "callback": callback
    });
  };
  Controller = (function() {
    function Controller(base, scope) {
      var router;
      router = {};
      routeMethods.forEach(function(method) {
        routes[method] = [];
        return router[method] = function(route, callback) {
          if (typeof route !== "string") {
            callback = route;
            route = "";
          }
          return registerRoute(method, base + route, callback);
        };
      });
      router.before = function(filter) {
        return filters.before.push(filter);
      };
      scope(router);
      window.onPopState = function(event) {
        var method, params, url;
        params = event.state.params;
        method = event.state.method;
        url = document.location.pathname;
        if (method === "get" || method === "delete") {
          this[method](url, false);
        }
        if (method === "put" || method === "post") {
          return this[method](url, params, false);
        }
      };
    }
    return Controller;
  })();
  window.Controller = Controller;
  window.Router = {
    get: function(url, push) {
      return matchRoute("get", url, push);
    },
    post: function(url, params, push) {
      return matchRoute("post", url, params, push);
    },
    put: function(url, params, push) {
      return matchRoute("put", url, params, push);
    },
    "delete": function(url, push) {
      return matchRoute("delete", url, push);
    }
  };
}).call(this);

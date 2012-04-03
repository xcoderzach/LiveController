LiveController API Documentation
================================

###Controller

#####LiveController.Controller(base, scope)

`base` is a string the URL over which the controller acts. (ex. "/posts")
`scope` is a function in which routes are defined.

###navigate

#####LiveController.navigate(url, opts)

Navigates to the specified `url`. 
`opts` determines whether the navigation is done through `refresh`
(document.location) or `push` (history.pushState, not supported on older
browsers). Optional. Defaults to `push`.


###get

#####scope.get(route, callback)

`route` is the route for a particular view. `callback` is the function in which
the view is created.

###before

#####scope.before(fn)

`fn` is run before the controller gets a route.

###after

#####scope.after(fn)

`fn` is run after the controller gets a route.

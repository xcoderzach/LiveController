LiveController API Documentation
================================

###Controller

#####LiveController.Controller(base, scope)

`base` is a string the URL over which the controller acts. (ex. "/posts")
`scope` is a function in which routes are defined.

```javascript
controller = new LiveController("/posts", function(app) {
  app.get("/show/:id", function() {
    //do stuff
  })
})
```

###navigate

#####LiveController.navigate(url, opts)

Navigates to the specified `url`.

Options:
  * method - accepts strings `push` and `reload`. `push` is used by default. 
    * push - (default) use history.pushState to navigate without refreshing the page.
    * refresh - uses document.location to navigate by refreshing page, included for older browser support.

###get

#####scope.get(route, callback)

`route` is the route for a particular view. `callback` is the function in which
the view is created.

```javascript
LiveController.get("/", function() {
  //do stuff
})
```

###before

#####scope.before(fn)

`fn` is run before the controller gets a route.


###after

#####scope.after(fn)

`fn` is run after the controller gets a route.

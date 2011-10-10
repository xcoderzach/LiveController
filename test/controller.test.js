ControllerTest = TestCase("ControllerTest")

ControllerTest.prototype.testGETRoute = function() {
  expectAsserts(1)
  var controller = new Controller("/things", function(thing) {
    thing.get(function() {
      assertTrue("w00t", true)
    })
  })

  Router.get("/things")
}

ControllerTest.prototype.testGETRouteWithParams = function() {
  expectAsserts(1)
  var controller = new Controller("/things", function(thing) {
    thing.get("/:id", function(params) {
      assertEquals("wrong params", 42, params.id)
    })
  })
  Router.get("/things/42")
} 

ControllerTest.prototype.testPOSTRoute = function() {
  expectAsserts(1)
  var controller = new Controller("/things", function(thing) {
    thing.post(function(params) {
      assertEquals("wrong params", "posted", params.postit)
    })
  })
  Router.post("/things", { postit: "posted" })
} 


ControllerTest.prototype.testPOSTRouteWithURLParams = function() {
  expectAsserts(2)
  var controller = new Controller("/things/:id", function(thing) {
    thing.post(function(params) {
      assertEquals("wrong params", 42, params.id)
      assertEquals("wrong params", "posted", params.postit)
    })
  })
  Router.post("/things/42", { postit: "posted" })
} 

ControllerTest.prototype.testPUTRoute = function() {
  expectAsserts(1)
  var controller = new Controller("/things", function(thing) {
    thing.put(function(params) {
      assertEquals("wrong params", "posted", params.postit)
    })
  })
  Router.put("/things", { postit: "posted" })
}  

ControllerTest.prototype.testDELETERoute = function() {
  expectAsserts(1)
  var controller = new Controller("/things", function(thing) {
    thing.delete("/:id", function(params) {
      assertEquals("wrong params", 42, params.id)
    })
  })
  Router.delete("/things/42")
}  

ControllerTest.prototype.testTwoMatchingRoutes = function() {
  expectAsserts(1)
  var controller = new Controller("/things", function(thing) {
    thing.get("/:id", function(params) {
      assertEquals("wrong params", 42, params.id)
    })

    thing.get("/:cd", function(params) {
      fail("should not be called")
    }) 
  })
  Router.get("/things/42")
} 

/**
 * There should be tests for the pop/pushstate stuff but jstest driver doesn't test 
 * urls correctly
 **/

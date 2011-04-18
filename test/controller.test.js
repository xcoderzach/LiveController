ControllerTest = TestCase("ControllerTest")

ControllerTest.prototype.testGETRoute = function() {
  expectAsserts(1)
  var controller = new Controller("/things", function(thing) {
    thing.get(function() {
      assertTrue("w00t", true)
    })
  })

  Controller.get("/things")
}

ControllerTest.prototype.testGETRouteWithParams = function() {
  expectAsserts(1)
  var controller = new Controller("/things", function(thing) {
    thing.get("/:id", function(params) {
      assertEquals("wrong params", 42, params.id)
    })
  })
  Controller.get("/things/42")
} 

ControllerTest.prototype.testPOSTRoute = function() {
  expectAsserts(1)
  var controller = new Controller("/things", function(thing) {
    thing.post(function(params) {
      assertEquals("wrong params", "posted", params.postit)
    })
  })
  Controller.post("/things", { postit: "posted" })
} 

Live Controller v0.0.1
===============

  Here's an example

    var controller = new Controller("/things", function(thing) {

      thing.get(function(params) {

      }) 

      thing.get("/:id", function(params) {

      }) 

      thing.delete("/:id", function(params) {

      })

      thing.put("/:id", function(params) {

      })

      thing.post(function(params) {

      })

    }) 

  And here's how you send invoke them

    Controller.get("/things")

    Controller.get("/things/12")

    Controller.delete("/things/42")

    Controller.put("/things/42", {"title: "w00t"})

    Controller.post("/things", {"title: "w00t"})

### TODO before releasing this,
  * Can we use something better by someone else?
  * Get rid of http verbs, they dumb
  * fallback for shitty browsers with #!
  * Documentation

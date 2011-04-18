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

    Controller.get("/things", {"title: "w00t"})

    Controller.get("/things/12", {"title: "w00t"})

    Controller.delete("/things/42", {"title: "w00t"})

    Controller.put("/things/42", {"title: "w00t"})

    Controller.post("/things", {"title: "w00t"})

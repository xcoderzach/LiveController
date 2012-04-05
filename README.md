Live Controller v0.0.1
======================

Table of Contents
-----------------
  * [Introduction](#introduction)
  * [API docs](#api)
  * [Experimental API docs](#experimental)
  * [Examples](#examples)
  * [Tests](#tests)
  * [Contributing](#contributing)
  * [Contributors](#contributors)
  * [License](#license)

<a name="introduction"></a>

Introduction
------------

Live Controller is a tiny, client-side router that uses window.pushState and falls back to regular page refreshes when pushState is not available.

<a name="api"></a>

API docs
--------

You can find the API docs in the docs folder.

<a name="experimental"></a>

Experimental API docs
---------------------

Expelrimental API docs will be made available when any part of the project isn't experimental.

<a name="examples"></a>

Examples
--------

###Here's an example

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

###And here's how you send invoke them

  Controller.get("/things")

  Controller.get("/things/12")

  Controller.delete("/things/42")

  Controller.put("/things/42", {"title: "w00t"})

  Controller.post("/things", {"title: "w00t"})

Contributing
------------

Ideas, feature requests, bug reports, etc are very welcome.

### TODO before releasing this,
  * Can we use something better by someone else?
  * Get rid of http verbs, they dumb
  * fallback for shitty browsers with #!

<a name="contributors"></a>

Contributors
------------

  * Zach Smith @xcoderzach
  * Eugene Butler @EButlerIV

<a name = "license"></a>
 
License
-------

MIT Licensed (see LICENSE.txt)

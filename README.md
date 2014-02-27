mongoose-friendly
==============
[![Build Status](https://travis-ci.org/gtramontina/mongoose-friendly.png)](https://travis-ci.org/gtramontina/mongoose-friendly)
[![Dependency Status](https://gemnasium.com/gtramontina/mongoose-friendly.png)](https://gemnasium.com/gtramontina/mongoose-friendly)
[![NPM version](https://badge.fury.io/js/mongoose-friendly.png)](http://badge.fury.io/js/mongoose-friendly)

Friendly URLs for you Mongoose models.

## Usage
Simply install the `mongoose-friendly` plugin in your schema like this:

```javascript
var mongoose = require('mongoose');
var friendly = require('mongoose-friendly');
var MySchema = new mongoose.Schema({ title: String });
MySchema.plugin(friendly);
```

A static method `findByFriendly` is added to your schema, and you can use it as if you were using `findById`.

Here are the options (as defaults) you can pass when installing the plugin:

```javascript
MySchema.plugin(friendly, {
  source: 'title',  // Attribute to generate the friendly version from.
  friendly: 'slug', // Attribute to set the friendly version of source.
  update: false,    // Updates friendly field on subsequent saves.
  addIndex: true,   // Sets {unique: true} as index for the friendly attribute.
  findById: true    // Turns findById into an alias for findByFriendly.
});
```

## License
This is licensed under the feel-free-to-do-whatever-you-want-to-do license.

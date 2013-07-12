# X11 Desktop Entry [![Build Status](https://secure.travis-ci.org/opatry/node-X11-desktop-entry.png?branch=master)](http://travis-ci.org/opatry/node-X11-desktop-entry)

NodeJS X11 Desktop Entry

[FreeDesktop Desktop Entry Spec. 1.0](http://standards.freedesktop.org/desktop-entry-spec/desktop-entry-spec-1.0.html)

## Getting Started
Install the module using [npm](https://npmjs.org/):
```bash
$ npm install X11-desktop-entry
```

Write a NodeJS script using the library and load a Desktop Entry file:
```
[Desktop Entry]
Version=1.0
Encoding=UTF-8
Type=MimeType
Comment=This is a comment
```

```javascript
var desktop_entry = require('desktop-entry');
desktop_entry.load('./myfile.entry',
	function(model){
		// model is a JSON representation of the Desktop Entry file
		// where sections are roots of JSON object
		// each root contains a list of {key:value} objects.
		console.log(model["Desktop Entry"].Version);
	},
	function(errorMessage){
		// handle error here
	}
);
```

Finally invoke `node` on it:

```bash
$ node mytest.js
```

## License
Copyright (c) 2013 opatry  
Licensed under the MIT license.

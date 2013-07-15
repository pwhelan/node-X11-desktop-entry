# X11 Desktop Entry [![Build Status](https://secure.travis-ci.org/opatry/node-X11-desktop-entry.png?branch=master)](http://travis-ci.org/opatry/node-X11-desktop-entry)

NodeJS X11 Desktop Entry is a NodeJS Library used to load and handle X11 Desktop Entries as defined by the [FreeDesktop Desktop Entry Spec. 1.0](http://standards.freedesktop.org/desktop-entry-spec/desktop-entry-spec-1.0.html).

## Getting Started
Install the module using [npm](https://npmjs.org/):
```bash
$ npm install desktop-entry
```

Write a NodeJS script using the library and load a Desktop Entry file:
```
[Desktop Entry]
Version=1.0
Encoding=UTF-8
Type=MimeType
Comment=This is a comment
```

[getting-started.js](examples/getting-started.js)
```javascript
var desktopEntry = require('desktop-entry');
desktopEntry.load({
	entry:'./myfile.desktop',
	onSuccess:function(model){
		// model is a JSON representation of the Desktop Entry file
		// where sections are roots of JSON object
		// each root contains a list of {key:value} objects.
		console.log(model["Desktop Entry"].Version);
	},
	onError:function(errorMessage){
		// handle error here
	}
});
```

Finally invoke `node` on it:

```bash
$ node getting-started.js
```

## License
Copyright (c) 2013 opatry  
Licensed under the MIT license.

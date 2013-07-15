var desktopEntry = require('../lib/desktop-entry');

desktopEntry.load({
	entry:'./myfile.desktop',
	onSuccess:function(model){
		// model is a JSON representation of the Desktop Entry file
		// where headers are roots of JSON object
		// each root contains a list of {key:value} objects.
		console.log("The Desktop Entry 'Version' key is: " + model["Desktop Entry"].Version);
	},
	onError:function(errorMessage){
		// handle error here
		console.log("Error while loading desktop entry file: " + errorMessage);
	}
});
var desktop_entry = require('desktop-entry');

desktop_entry.load({
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
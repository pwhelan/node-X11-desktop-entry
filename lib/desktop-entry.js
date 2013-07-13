/*
 * X11-desktop-entry https://github.com/opatry/node-X11-desktop-entry
 * 
 * Copyright (c) 2013 opatry Licensed under the MIT license.
 */

'use strict';

/*
 * 3rd Party Modules imports
 */
var Lazy = require("lazy");
var fs = require("fs");
var S = require("string");

/**
 * <p>
 * Loads a Desktop Entry and give its JSON representation to
 * <code>onSuccess</code> callback (or calling <code>onError</code> callback
 * on invalid entry).<br>
 * Each header resides at the JSON representation root.
 * </p>
 * <p>
 * Example:
 * </p>
 * 
 * <pre>
 * desktop_entry.load({
 * 	entry:'xxx.entry',
 * 	onSuccess:function(model) {
 * 		// everything goes fine
 * 	},
 * 	onError:function(errorMessage) {
 * 		// something goes wrong
 * 	}
 * });
 * </pre>
 * 
 * @param config Configuration of the loading.
 * 	<ul>
 * 		<li><code>'config.entry'</code> the Desktop Entry file to be loaded.
 * 		<li><code>'config.onSuccess'</code> the function to call once loading is done (giving the JSON
 *						representation of the Desktop Entry if valid).
 * 		<li><code>'config.onError'</code> the function to call once loading ends with an error.
 * 		<li><code>'config.onError'</code> the function to call once loading ends with an error.
 * 		<li><code>'config.lineFilter'</code> the optional line filter function to call on each line (must return <code>false</code> if line need to be filtered).
 * 	</ul>
 */
exports.load = function(config) {
	var entry = config.entry ;//|| throw new Error("'entry' config must be defined."); // FIXME NLS
	var onSuccess = config.onSuccess;// || throw new Error(""));
	var onError = config.onError;
	var lineFilter = config.lineFilter || function(line) {
		// handle node-lazy #11 issue: https://github.com/pkrumins/node-lazy/issues/11
		if (line == 0 || line === undefined) {
			return false;
		}
		// ignore comments and empty lines
		var Sline = S(line);
		return !(Sline.startsWith('#') || Sline.trim().isEmpty());
	};
	
	// TODO handle optional parameters (line filter
	
	// TODO JSDoc the Key[foo] to JSON mapping
	var lazy = new Lazy(fs.createReadStream(entry));
	// FIXME catch error on stream creation

	var model = {}; // the JSON representation of this desktop entry
	var currentHeaderContents = null;
	var pendingError = null;

	var lines = lazy.lines.filter(lineFilter);

	// walk over each not filtered lines
	lines.forEach(function(line) {
		if(pendingError !== null) {
			// already totally fucked up
			// FIXME wants to stop forEach loop from here, can we?
			return;
		}
		
		var Sline = S(line);
		// TODO check that the first element is the [Desktop Entry] header
		var header = Sline.between('[', ']').s;
		if (header) {
			// we've got a new header here
			// if the header is [Desktop Entry], it must be the first header
			if("Desktop Entry".localeCompare(currentHeader) && currentHeaderContents !== null){ // FIXME const
				pendingError = "Invalid Desktop Entry: the Desktop Entry must be the first header."; // FIXME const + NLS
				return;
			}
			var currentHeader = header.trim();
			// each new header ends the previous one
			currentHeaderContents = [];
			model[currentHeader] = currentHeaderContents;
		} else {
			// regular line: key = value

			if (currentHeaderContents === null) {
				// reading an entry without a header first denotes an invalid Desktop Entry
				pendingError = "Invalid Desktop Entry: no top level header."; // FIXME NLS
				return;
			}

			var tokens = Sline.s.split("=");
			if (tokens.length !== 2) {
				// we expect key = value lines here
				pendingError = "Invalid Desktop Entry: " + Sline.s + " not a valid Entry format."; // FIXME NLS
				return;
			}

			// /!\ ignore space around '=' sign
			var key = tokens[0].trim();
			
			// FIXME handle key[locale] patterns
			if(!key.match(/[a-zA-Z0-9\-]+/g)){ // FIXME put in cache as a RegExp object
				pendingError = "Invalid Desktop Entry: invalid key: " + key + " (must match [a-zA-Z0-9\-])"; // FIXME NLS
				return;
			}
			
			var value = tokens[1].trim();
			currentHeaderContents[key] = value;
		}
	}).join(function() {
		if (model["Desktop Entry"] === undefined) { // FIXME const
			pendingError = "Invalid Desktop Entry: no Desktop Entry header."; // FIXME const + NLS
		}
		
		if(pendingError !== null){
			onError(pendingError);
			return;
		}
		onSuccess(model);
	});
};

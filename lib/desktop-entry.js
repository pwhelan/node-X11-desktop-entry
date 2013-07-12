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
 * Each section resides at the JSON representation root.
 * </p>
 * <p>
 * Example:
 * </p>
 * 
 * <pre>
 * desktop_entry.load('xxx.entry', function(model) {
 * 	// everything goes fine
 * 	}, function(errorMessage) {
 * 		// something goes wrong
 * 	});
 * </pre>
 * 
 * @param entry the Desktop Entry file to be loaded
 * @param onSuccess the function to call once loading is done (giving the JSON
 *						representation of the Desktop Entry if valid)
 * @param onError the function to call once loading ends with an error
 */
exports.load = function(entry, onSuccess, onError) {
	// TODO JSDoc the Key[foo] to JSON mapping
	var lazy = new Lazy(fs.createReadStream(entry));
	// FIXME catch error on stream creation

	var model = {}; // the JSON representation of this desktop entry
	var currentSectionContents = null;
	var pendingError = null;

	var lines = lazy.lines.filter(function(line) {
		// handle node-lazy #11 issue: https://github.com/pkrumins/node-lazy/issues/11
		if (line == 0 || line === undefined) {
			return false;
		}
		// ignore comments and empty lines
		var Sline = S(line);
		return !(Sline.startsWith('#') || Sline.trim().isEmpty());
	});

	// walk over each not filtered lines
	lines.forEach(function(line) {
		if(pendingError !== null) {
			// already totally fucked up
			// FIXME wants to stop forEach loop from here, can we?
			return;
		}
		
		var Sline = S(line);
		// TODO check that the first element is the [Desktop Entry] section
		var section = Sline.between('[', ']').s;
		if (section) {
			// we've got a new section here
			// if the section is [Desktop Entry], it must be the first section
			if("Desktop Entry".localeCompare(currentSection) && currentSectionContents !== null){ // FIXME const
				pendingError = "Invalid Desktop Entry: the Desktop Entry must be the first section."; // FIXME const + NLS
				return;
			}
			var currentSection = section.trim();
			// each new section ends the previous one
			currentSectionContents = [];
			model[currentSection] = currentSectionContents;
		} else {
			// regular line: key = value

			if (currentSectionContents === null) {
				// reading an entry without a section first denotes an invalid Desktop Entry
				pendingError = "Invalid Desktop Entry: no top level section."; // FIXME NLS
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
			var value = tokens[1].trim();
			currentSectionContents[key] = value;
		}
	}).join(function() {
		if (model["Desktop Entry"] === undefined) { // FIXME const
			pendingError = "Invalid Desktop Entry: no Desktop Entry section."; // FIXME const + NLS
		}
		
		if(pendingError !== null){
			onError(pendingError);
			return;
		}
		onSuccess(model);
	});
};

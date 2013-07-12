'use strict';

var desktop_entry = require('../lib/desktop-entry.js');
var path = require("path");
var domain = require("domain");

exports.testLoad = {
	simple : function(test) {
		test.expect(1);
		
		// FIXME retrieve the resource relatively to the test, not the cwd
		desktop_entry.load('./test/testSimple.entry',
				function(model) {
					test.ok(true);
					test.done();
				},
				function(errorMessage) {
					test.ok(false, "Valid Desktop Entry shouldn't trigger the error callback.");
					test.done();
				}
		);
	},

	model : function(test) {
		test.expect(6);

		// FIXME retrieve the resource relatively to the test, not the cwd
		desktop_entry.load('./test/testSimple.entry', function(entry) {
			test.notStrictEqual(entry, undefined);

			var defaultSection = entry["Desktop Entry"];

			test.notEqual(defaultSection, undefined);

			test.strictEqual(defaultSection.Version, "1.0");
			test.strictEqual(defaultSection.Encoding, "UTF-8");
			test.strictEqual(defaultSection.Type, "MimeType");
			test.strictEqual(defaultSection.Comment, "This is a comment");

			test.done();
		},function(errorMessage){
			test.ok(false, "Valid Desktop Entry shouldn't trigger the error callback.");
			test.done();
		});
	},

	 noDesktopEntryFirstSection : function(test) {
		 test.expect(1);
		
		 // FIXME retrieve the resource relatively to the test, not the cwd
		 desktop_entry.load('./test/testNoDesktopEntryFirstSection.entry',
			function(model) {
				test.ok(false, "Invalid Desktop Entry (no Desktop Entry as first section) must trigger the error callback.");
				test.done();
			},
			function(errorMessage){
				test.ok(true);
				test.done();
			}
		);
	 },

	 noDesktopEntrySection : function(test) {
		 test.expect(1);
		 // FIXME retrieve the resource relatively to the test, not the cwd
		 desktop_entry.load('./test/testNoDesktopEntrySection.entry',
			function(model) {
				test.ok(false, "Invalid Desktop Entry (no Desktop Entry section) must trigger the error callback.");
				test.done();
			},
			function(errorMessage){
				test.ok(true);
				test.done();
			}
		);
	 },

	noSection : function(test) {
		test.expect(1);
		// FIXME retrieve the resource relatively to the test, not the cwd
		desktop_entry.load('./test/testNoSection.entry',
			function(model) {
				test.ok(false, "Invalid Desktop Entry (no section) must trigger the error callback.");
				test.done();
			},
			function(errorMessage){
				test.ok(true);
				test.done();
			}
		);
	},

	leadingEmptyLines : function(test) {
		test.expect(1);
		// FIXME retrieve the resource relatively to the test, not the cwd
		desktop_entry.load('./test/testLeadingEmptyLines.entry',
			function(entries) {
				test.ok(true);
				test.done();
			},function(errorMessage){
				test.ok(false, "Valid Desktop Entry (leading empty lines) should'nt trigger the error callback.");
				test.done();
			}
		);
	},

	trailingEmptyLines : function(test) {
		test.expect(1);
		// FIXME retrieve the resource relatively to the test, not the cwd
		desktop_entry.load('./test/testTrailingEmptyLines.entry',
			function(entries) {
				test.ok(true);
				test.done();
			},function(errorMessage){
				test.ok(false, "Valid Desktop Entry (trailing empty lines) should'nt call the error callback");
				test.done();
			}
		);
	},
};

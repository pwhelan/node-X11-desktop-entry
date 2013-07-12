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
				test.ok(false, "Valid Desktop Entry (leading empty lines) shouldn't trigger the error callback.");
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
				test.ok(false, "Valid Desktop Entry (trailing empty lines) shouldn't trigger the error callback");
				test.done();
			}
		);
	},
	
	validKeyNames: function(test){
		test.expect(5);
		// FIXME retrieve the resource relatively to the test, not the cwd
		desktop_entry.load('./test/testValidKeyNames.entry',
			function(menu) {
				var entries = menu["Desktop Entry"];
				test.strictEqual(entries["abcdefghijklmnopqrst"], "lowercase_alpha");
				test.strictEqual(entries["ABCDEFGHIJKLMNOPQRST"], "uppercase_alpha");
				test.strictEqual(entries["0123456789"], "numbers");
				test.strictEqual(entries["-"], "dash");
				test.strictEqual(entries["abcdefghijklmnopqrst-0123456789-ABCDEFGHIJKLMNOPQRST"], "mixed");
				test.done();
			},function(errorMessage){
				test.ok(false, "Valid Desktop Entry (key name matches [A-Za-z0-9-]+) shouldn't trigger the error callback");
				test.done();
			}
		);
	},
	
	invalidKeyNames001: function(test){
		test.expect(1);
		// FIXME retrieve the resource relatively to the test, not the cwd
		desktop_entry.load('./test/testInvalidKeyNames001.entry',
			function(entries) {
				test.ok(false, "Invalid Desktop Entry (key name doesn't match [A-Za-z0-9-]+) must trigger the error callback");
				test.done();
			},function(errorMessage){
				test.ok(true);
				test.done();
			}
		);
	},
	
	invalidKeyNames002: function(test){
		test.expect(1);
		// FIXME retrieve the resource relatively to the test, not the cwd
		desktop_entry.load('./test/testInvalidKeyNames002.entry',
			function(entries) {
				test.ok(false, "Invalid Desktop Entry (key name doesn't match [A-Za-z0-9-]+) must trigger the error callback");
				test.done();
			},function(errorMessage){
				test.ok(true);
				test.done();
			}
		);
	},
	
	// TODO ignore space between '=' sign for entries
//	ignoreSpace : function(test){},
	
	// TODO ensures entry key names are case sensitive
	caseSensitivity : function(test){
		test.expect(3);
		// FIXME retrieve the resource relatively to the test, not the cwd
		desktop_entry.load('./test/testCaseSensitivity.entry',
			function(menu) {
				var entries = menu["Desktop Entry"];
				test.strictEqual(entries["aaa"], "lowercase");
				test.strictEqual(entries["AAA"], "uppercase");
				test.strictEqual(entries["aAa"], "mixed");
				test.done();
			},function(errorMessage){
				test.ok(false, "Valid Desktop Entry (key name matches [A-Za-z0-9-]+) shouldn't trigger the error callback");
				test.done();
			}
		);
	
	},
	
	// TODO not allowed in same section, allowed in different sections
//	entryKeyDuplication : function(test){},
};

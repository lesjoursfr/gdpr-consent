import { addScript } from "../utils/dom";

export default () => ({
	key: "twitter",
	type: "social",
	name: "Twitter",
	uri: "https://support.twitter.com/articles/20170514",
	needConsent: true,
	cookies: [],
	js: function() {
		"use strict";
		addScript("//platform.twitter.com/widgets.js", "twitter-wjs");
	},
});
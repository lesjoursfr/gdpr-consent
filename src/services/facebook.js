import { addScript } from "../utils/dom";
import { getLocale } from "../utils/lang";

export default () => ({
	key: "facebook",
	type: "social",
	name: "Facebook",
	uri: "https://www.facebook.com/policies/cookies/",
	needConsent: true,
	lazyConsent: false,
	cookies: [],
	js: function() {
		"use strict";
		addScript("//connect.facebook.net/" + getLocale() + "/sdk.js", "facebook-jssdk");
	},
});
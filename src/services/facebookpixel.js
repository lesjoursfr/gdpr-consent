/* globals fbq: true */
import { addScript } from "../utils/dom";

export default () => ({
	key: "facebookpixel",
	type: "ads",
	name: "Facebook Pixel",
	uri: "https://www.facebook.com/policies/cookies/",
	needConsent: true,
	cookies: [],
	js: function() {
		"use strict";
		addScript("//connect.facebook.net/en_US/fbevents.js", "facebook-fbevents", function() {
			// eslint-disable-next-line no-undef
			fbq("init", GDPRConsentUser.fbPixelId);
			fbq("track", "PageView");
		});
	},
});
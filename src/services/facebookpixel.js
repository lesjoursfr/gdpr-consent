/* globals fbq: true */
import { addScript } from "../utils/dom";

export default () => ({
	key: "facebookpixel",
	type: "ads",
	name: "Facebook Pixel",
	uri: "https://www.facebook.com/policies/cookies/",
	needConsent: true,
	cookies: ["datr", "fr", "reg_ext_ref", "reg_fb_gate", "reg_fb_ref", "sb", "wd", "x-src"],
	js: function() {
		"use strict";
		var n;
		if (window.fbq) {return;}
		n = window.fbq = function() {
			n.callMethod ?
				n.callMethod.apply(n, arguments) : n.queue.push(arguments);
		};
		if (!window._fbq) {window._fbq = n;}
		n.push = n;
		n.loaded = !0;
		n.version = "2.0";
		n.queue = [];
		addScript("//connect.facebook.net/en_US/fbevents.js", "facebook-fbevents", function() {
			// eslint-disable-next-line no-undef
			fbq("init", GDPRConsentUser.fbPixelId);
			fbq("track", "PageView");
		});
	},
});
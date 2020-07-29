/* globals gtag: true */
import { addScript } from "../utils/dom";

export default (GDPRConsentUser) => ({
	key: "gtag",
	type: "analytic",
	name: "Google Analytics (gtag.js)",
	uri: "https://support.google.com/analytics/answer/6004245",
	needConsent: true,
	cookies: (function() {
		// Add _gat_gtag_UA_XXXXXXX_XX cookie to cookies array
		var gatGtagUaCookie = "_gat_gtag_" + GDPRConsentUser.gtagUa;
		gatGtagUaCookie = gatGtagUaCookie.replace(/-/g, "_");
		return ["_ga", "_gat", "_gid", "__utma", "__utmb", "__utmc", "__utmt", "__utmz", gatGtagUaCookie];
	})(),
	js: function() {
		"use strict";
		window.dataLayer = window.dataLayer || [];
		addScript("https://www.googletagmanager.com/gtag/js?id=" + GDPRConsentUser.gtagUa, "", function() {
			// eslint-disable-next-line no-undef
			window.gtag = function gtag() {dataLayer.push(arguments);};
			gtag("js", new Date());

			if (GDPRConsentUser.gtagInitOptions) {
				gtag("config", GDPRConsentUser.gtagUa, GDPRConsentUser.gtagInitOptions);
			} else {
				gtag("config", GDPRConsentUser.gtagUa);
			}

			if (typeof GDPRConsentUser.gtagMore === "function") {
				GDPRConsentUser.gtagMore();
			}
		});
	}
});
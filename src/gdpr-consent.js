import "./css/main.scss";
import { sendEvent } from "./utils/event";
import { css } from "./utils/dom";
import languages from "./languages/index";
import services from "./services/index";
import cookies from "./modules/cookies";
import events from "./modules/events";
import userInterface from "./modules/user-interface";

const GDPRConsent = {
	user: {},
	lang: {},
	services: {},
	added: [],
	idprocessed: [],
	state: [],
	launch: [],
	parameters: {},
	reloadThePage: false,
	alreadyLaunch: 0,
	init: function(params) {
		"use strict";

		GDPRConsent.parameters = params || {};
		if (GDPRConsent.alreadyLaunch === 0) {
			GDPRConsent.alreadyLaunch = 1;
			if (window.addEventListener) {
				window.addEventListener("load", function() {
					GDPRConsent.load();
				}, false);
				window.addEventListener("scroll", function() {
					events.scrollEvent(GDPRConsent.parameters);
				}, false);

				window.addEventListener("keydown", function(evt) {
					events.keydownEvent(false, evt);
				}, false);
				window.addEventListener("hashchange", function() {
					events.hashchangeEvent(GDPRConsent.parameters);
				}, false);
				window.addEventListener("resize", function() {
					events.resizeEvent();
				}, false);
			} else {
				window.attachEvent("onload", function() {
					GDPRConsent.load();
				});
				window.attachEvent("onscroll", function() {
					events.scrollEvent(GDPRConsent.parameters);
				});
				window.attachEvent("onkeydown", function(evt) {
					events.keydownEvent(true, evt);
				});
				window.attachEvent("onhashchange", function() {
					events.hashchangeEvent(GDPRConsent.parameters);
				});
				window.attachEvent("onresize", function() {
					events.resizeEvent();
				});
			}
		}
	},
	load: function() {
		"use strict";
		var defaults = {
			hashtag: "#tarteaucitron",
			cookieName: "tarteaucitron",
			timeExpire: 31536000000,
			highPrivacy: false,
			AcceptAllCta: true,
			moreInfoLink: true,
			mandatory: true
		};

		// Get params
		if (GDPRConsent.parameters !== undefined) {
			// eslint-disable-next-line one-var
			for (var k in defaults) {
				if (!Object.prototype.hasOwnProperty.call(GDPRConsent.parameters, k)) {
					GDPRConsent.parameters[k] = defaults[k];
				}
			}
		}

		// Load language and services
		GDPRConsent.lang = languages.getCurrent();
		GDPRConsent.services = services.getServices(GDPRConsent.user);

		// eslint-disable-next-line one-var
		var body = document.body,
			div = document.createElement("div"),
			html = "",
			index,
			cat = ["ads", "analytic", "api", "comment", "social", "support", "video", "other"],
			i;

		cat = cat.sort(function(a, b) {
			if (GDPRConsent.lang[a].title > GDPRConsent.lang[b].title) { return 1; }
			if (GDPRConsent.lang[a].title < GDPRConsent.lang[b].title) { return -1; }
			return 0;
		});

		// Prepare the html
		// For the Pannel
		html += "<button type=\"button\" id=\"tarteaucitron-back\" onclick=\"GDPRConsent.closePanel();\" aria-label=\"" + GDPRConsent.lang.close + "\"></button>";
		html += "<div id=\"tarteaucitron\" role=\"dialog\" aria-labelledby=\"dialogTitle\">";
		html += "   <button type=\"button\" id=\"tarteaucitron-close-panel\" onclick=\"GDPRConsent.closePanel();\">&#128473;</button>";
		html += "   <div id=\"tarteaucitron-services\">";
		html += "      <div class=\"tarteaucitron-line tarteaucitron-main-line\" id=\"tarteaucitron-main-line-offset\">";
		html += "         <span class=\"tarteaucitron-h1\" role=\"heading\" aria-level=\"1\" id=\"dialogTitle\">"+ GDPRConsent.lang.title + "</span>";
		html += "         <div id=\"tarteaucitron-info\">";
		html += "         " + GDPRConsent.lang.disclaimer;
		html += "         </div>";
		html += "         <div class=\"tarteaucitron-name\">";
		html += "            <span class=\"tarteaucitron-h2\" role=\"heading\" aria-level=\"2\">" + GDPRConsent.lang.all + "</span>";
		html += "         </div>";
		html += "         <div class=\"tarteaucitron-ask\" id=\"tarteaucitronScrollbarAdjust\">";
		html += "            <button type=\"button\" id=\"tarteaucitron-all-allowed\" class=\"tarteaucitron-allow\" onclick=\"GDPRConsent.respondAll(true);\">";
		html += "               &#10003; " + GDPRConsent.lang.allowAll;
		html += "            </button> ";
		html += "            <button type=\"button\" id=\"tarteaucitron-all-denied\" class=\"tarteaucitron-deny\" onclick=\"GDPRConsent.respondAll(false);\">";
		html += "               &#10007; " + GDPRConsent.lang.denyAll;
		html += "            </button>";
		html += "         </div>";
		html += "      </div>";
		html += "      <div class=\"tarteaucitron-border\">";
		html += "         <div class=\"clear\"></div><ul>";
		if (GDPRConsent.parameters.mandatory === true) {
			html += "<li id=\"tarteaucitron-servicesTitle_mandatory\">";
			html += "<div class=\"tarteaucitron-title\">";
			html += "   <button type=\"button\">&nbsp; " + GDPRConsent.lang.mandatoryTitle + "</button>";
			html += "</div>";
			html += "<ul id=\"tarteaucitron-services_mandatory\">";
			html += "<li class=\"tarteaucitron-line\">";
			html += "   <div class=\"tarteaucitron-name\">";
			html += "       <span class=\"tarteaucitron-h3\" role=\"heading\" aria-level=\"3\">" + GDPRConsent.lang.mandatoryText + "</span>";
			html += "       <span class=\"tarteaucitron-list-cookies\"></span><br/>";
			html += "   </div>";
			html += "   <div class=\"tarteaucitron-ask\">";
			html += "       <button type=\"button\" class=\"tarteaucitron-allow\">";
			html += "           &#10003; " + GDPRConsent.lang.allow;
			html += "       </button> ";
			html += "   </div>";
			html += "</li>";
			html += "</ul></li>";
		}
		for (i = 0; i < cat.length; i += 1) {
			html += "         <li id=\"tarteaucitron-servicesTitle_" + cat[i] + "\" class=\"tarteaucitron-hidden\">";
			html += "            <div class=\"tarteaucitron-title\">";
			html += "               <button type=\"button\" onclick=\"GDPRConsent.toggle('tarteaucitron-details" + cat[i] + "', 'tarteaucitron-infoBox');return false\">&#10011; " + GDPRConsent.lang[cat[i]].title + "</button>";
			html += "            </div>";
			html += "            <div id=\"tarteaucitron-details" + cat[i] + "\" class=\"tarteaucitron-details tarteaucitron-infoBox\">";
			html += "               " + GDPRConsent.lang[cat[i]].details;
			html += "            </div>";
			html += "         <ul id=\"tarteaucitron-services_" + cat[i] + "\"></ul></li>";
		}
		html += "             <li id=\"tarteaucitronNoServicesTitle\" class=\"tarteaucitron-line\">" + GDPRConsent.lang.noServices + "</li>";
		html += "         </ul>";
		html += "         <div class=\"tarteaucitron-hidden\" id=\"tarteaucitronScrollbarChild\" style=\"height:20px;display:block\"></div>";
		html += "       </div>";
		html += "   </div>";
		html += "</div>";

		// For the Banner
		if (GDPRConsent.parameters.highPrivacy && !GDPRConsent.parameters.AcceptAllCta) {
			html += "<div id=\"tarteaucitron-alert-big\" class=\"tarteaucitron-alert-big-bottom\">";
			if (GDPRConsent.lang.siteDisclaimerTitle !== "" && GDPRConsent.lang.siteDisclaimerMessage !== "") {
				html += "   <span id=\"tarteaucitronSiteDisclaimerTitle\">";
				html += "       " + GDPRConsent.lang.siteDisclaimerTitle;
				html += "   </span>";
				html += "   <br />";
				html += "   <br />";
				html += "   <span id=\"tarteaucitronSiteDisclaimerMessage\">";
				html += "       " + GDPRConsent.lang.siteDisclaimerMessage;
				html += "   </span>";
				html += "   <br />";
			}
			html += "   <span id=\"tarteaucitron-disclaimer-alert\">";
			html += "       " + GDPRConsent.lang.alertBigPrivacy;
			html += "   </span>";
			html += "   <button type=\"button\" id=\"tarteaucitron-personalize\" onclick=\"GDPRConsent.openPanel();\">";
			html += "       " + GDPRConsent.lang.personalize;
			html += "   </button>";
			html += "</div>";
		} else {
			html += "<div id=\"tarteaucitron-alert-big\" class=\"tarteaucitron-alert-big-bottom\">";
			if (GDPRConsent.lang.siteDisclaimerTitle !== "" && GDPRConsent.lang.siteDisclaimerMessage !== "") {
				html += "   <span id=\"tarteaucitronSiteDisclaimerTitle\">";
				html += "       " + GDPRConsent.lang.siteDisclaimerTitle;
				html += "   </span>";
				html += "   <br />";
				html += "   <br />";
				html += "   <span id=\"tarteaucitronSiteDisclaimerMessage\">";
				html += "       " + GDPRConsent.lang.siteDisclaimerMessage;
				html += "   </span>";
				html += "   <br />";
			}
			html += "   <span id=\"tarteaucitron-disclaimer-alert\">";
			if (GDPRConsent.parameters.highPrivacy) {
				html += "       " + GDPRConsent.lang.alertBigPrivacy;
			} else {
				html += "       " + GDPRConsent.lang.alertBigClick + " " + GDPRConsent.lang.alertBig;
			}
			html += "   </span>";
			html += "   <button type=\"button\" id=\"tarteaucitron-personalize\" onclick=\"GDPRConsent.respondAll(true);\">";
			html += "       &#10003; " + GDPRConsent.lang.acceptAll;
			html += "   </button>";
			html += "   <button type=\"button\" id=\"tarteaucitron-close-alert\" onclick=\"GDPRConsent.openPanel();\">";
			html += "       " + GDPRConsent.lang.personalize;
			html += "   </button>";
			html += "</div>";
			html += "<div id=\"tarteaucitron-percentage\"></div>";
		}

		div.id = "tarteaucitron-root";

		// Append tarteaucitron: #tarteaucitron-root last-child of the body
		body.appendChild(div, body);
		div.innerHTML = html;

		// Send an event
		sendEvent("tac.root_available");

		if (GDPRConsent.job !== undefined) {
			GDPRConsent.job = GDPRConsent.cleanArray(GDPRConsent.job);
			for (index = 0; index < GDPRConsent.job.length; index += 1) {
				GDPRConsent.addService(GDPRConsent.job[index]);
			}
		} else {
			GDPRConsent.job = [];
		}

		GDPRConsent.job.push = function(id) {
			// ie <9 hack
			if (typeof GDPRConsent.job.indexOf === "undefined") {
				GDPRConsent.job.indexOf = function(obj, start) {
					var i,
						j = this.length;
					for (i = (start || 0); i < j; i += 1) {
						if (this[i] === obj) { return i; }
					}
					return -1;
				};
			}

			if (GDPRConsent.job.indexOf(id) === -1) {
				Array.prototype.push.call(this, id);
			}
			GDPRConsent.launch[id] = false;
			GDPRConsent.addService(id);
		};

		if (document.location.hash === GDPRConsent.hashtag) {
			userInterface.openPanel();
		}
	},
	addService: function(serviceId) {
		"use strict";
		var html = "",
			s = GDPRConsent.services,
			service = s[serviceId],
			cookie = cookies.read(GDPRConsent.parameters),
			hostname = document.location.hostname,
			hostRef = document.referrer.split("/")[2],
			isNavigating = (hostRef === hostname),
			isAutostart = (!service.needConsent),
			isWaiting = (cookie.indexOf(service.key + "=wait") >= 0),
			isDenied = (cookie.indexOf(service.key + "=false") >= 0),
			isAllowed = ((cookie.indexOf(service.key + "=true") >= 0) || (!service.needConsent && cookie.indexOf(service.key + "=false") < 0)),
			isResponded = (cookie.indexOf(service.key + "=false") >= 0 || cookie.indexOf(service.key + "=true") >= 0),
			isDNTRequested = (navigator.doNotTrack === "1" || navigator.doNotTrack === "yes" || navigator.msDoNotTrack === "1" || window.doNotTrack === "1");

		if (GDPRConsent.added[service.key] !== true) {
			GDPRConsent.added[service.key] = true;

			html += "<li id=\"" + service.key + "-line\" class=\"tarteaucitron-line\">";
			html += "   <div class=\"tarteaucitron-name\">";
			html += "       <span class=\"tarteaucitron-h3\" role=\"heading\" aria-level=\"3\">" + service.name + "</span>";
			html += "       <span id=\"tacCL" + service.key + "\" class=\"tarteaucitron-list-cookies\"></span><br/>";
			if (GDPRConsent.parameters.moreInfoLink === true) {
				html += "       <a href=\"" + service.uri + "\" target=\"_blank\" rel=\"noreferrer noopener\" title=\"" + service.name + " " + GDPRConsent.lang.newWindow + "\">";
				html += "           " + GDPRConsent.lang.source;
				html += "       </a>";
			}
			html += "   </div>";
			html += "   <div class=\"tarteaucitron-ask\">";
			html += "       <button type=\"button\" id=\"" + service.key + "Allowed\" class=\"tarteaucitron-allow\" onclick=\"GDPRConsent.respond(this, true);\">";
			html += "           &#10003; " + GDPRConsent.lang.allow;
			html += "       </button> ";
			html += "       <button type=\"button\" id=\"" + service.key  + "Denied\" class=\"tarteaucitron-deny\" onclick=\"GDPRConsent.respond(this, false);\">";
			html += "           &#10007; " + GDPRConsent.lang.deny;
			html += "       </button>";
			html += "   </div>";
			html += "</li>";

			css("tarteaucitron-servicesTitle_" + service.type, "display", "block");

			if (document.getElementById("tarteaucitron-services_" + service.type) !== null) {
				document.getElementById("tarteaucitron-services_" + service.type).innerHTML += html;
			}

			css("tarteaucitronNoServicesTitle", "display", "none");

			userInterface.order(service.type, GDPRConsent);
		}

		if ((!isResponded && (isAutostart || (isNavigating && isWaiting)) && !GDPRConsent.highPrivacy) || isAllowed) {
			if (!isAllowed) {
				cookies.create(service.key, true, GDPRConsent.parameters);
			}
			if (GDPRConsent.launch[service.key] !== true) {
				GDPRConsent.launch[service.key] = true;
				service.js();
				sendEvent(service.key + "_loaded");
			}
			GDPRConsent.state[service.key] = true;
			userInterface.color(service.key, true, GDPRConsent);
		} else if (isDenied) {
			if (typeof service.fallback === "function") {
				service.fallback();
			}
			GDPRConsent.state[service.key] = false;
			userInterface.color(service.key, false, GDPRConsent);
		} else if (!isResponded && isDNTRequested && GDPRConsent.handleBrowserDNTRequest) {
			cookies.create(service.key, "false", GDPRConsent.parameters);
			if (typeof service.fallback === "function") {
				service.fallback();
			}
			GDPRConsent.state[service.key] = false;
			userInterface.color(service.key, false, GDPRConsent);
		} else if (!isResponded) {
			cookies.create(service.key, "wait", GDPRConsent.parameters);
			if (typeof service.fallback === "function") {
				service.fallback();
			}
			userInterface.color(service.key, "wait", GDPRConsent);
			userInterface.openAlert();
		}

		cookies.checkCount(service.key, service, GDPRConsent.parameters);
		sendEvent(service.key + "_added");
	},
	cleanArray: function cleanArray(arr) {
		"use strict";
		var i,
			len = arr.length,
			out = [],
			obj = {},
			s = GDPRConsent.services;

		for (i = 0; i < len; i += 1) {
			if (!obj[arr[i]]) {
				obj[arr[i]] = {};
				if (GDPRConsent.services[arr[i]] !== undefined) {
					out.push(arr[i]);
				}
			}
		}

		out = out.sort(function(a, b) {
			if (s[a].type + s[a].key > s[b].type + s[b].key) { return 1; }
			if (s[a].type + s[a].key < s[b].type + s[b].key) { return -1; }
			return 0;
		});

		return out;
	},
	closePanel: function() {
		userInterface.closePanel(GDPRConsent);
	},
	openPanel: function() {
		userInterface.openPanel();
	},
	respondAll: function(status) {
		userInterface.respondAll(status, GDPRConsent, GDPRConsent.parameters);
	},
	respond: function(el, status) {
		userInterface.respond(el, status, GDPRConsent, GDPRConsent.parameters);
	},
	toggle: function(id, closeClass) {
		userInterface.toggle(id, closeClass);
	}
};

export default GDPRConsent;
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
				window.addEventListener("keydown", function(evt) {
					events.keydownEvent(false, evt);
				}, false);
				window.addEventListener("hashchange", function() {
					events.hashchangeEvent(GDPRConsent.parameters);
				}, false);
			} else {
				window.attachEvent("onload", function() {
					GDPRConsent.load();
				});
				window.attachEvent("onkeydown", function(evt) {
					events.keydownEvent(true, evt);
				});
				window.attachEvent("onhashchange", function() {
					events.hashchangeEvent(GDPRConsent.parameters);
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
			websiteName: undefined,
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
		html += "   <button type=\"button\" id=\"tarteaucitron-close-panel\" onclick=\"GDPRConsent.closePanel();\">X</button>";
		html += "	<div id=\"tarteaucitron-services\">";

		// L'en-tête des services
		html += "		<div id=\"tarteaucitron-services-top\">";
		html += "   		<span class=\"tarteaucitron-h1\" role=\"heading\" aria-level=\"1\" id=\"dialogTitle\">"+ GDPRConsent.lang.title + "</span>";
		html += "			<div id=\"tarteaucitron-info\">";
		html += "       	" + GDPRConsent.lang.disclaimer;
		if (GDPRConsent.parameters.websiteName) {
			html += "   	" + GDPRConsent.lang.disclaimerWebsite + " " + GDPRConsent.parameters.websiteName + ".";
		}
		html += "       	</div>";
		// Accepter tout ou interdire tout
		html += "			<div class=\"tarteaucitron-line\">";
		html += "               <span class=\"tarteaucitron-h3\" role=\"heading\" aria-level=\"2\">" + GDPRConsent.lang.all + "</span>";
		html += "            	<div class=\"tarteaucitron-ask\">";
		html += "               	<button type=\"button\" id=\"tarteaucitron-all-allowed\" class=\"tarteaucitron-allow\" onclick=\"GDPRConsent.respondAll(true);\">";
		html += "                  		&#10003; " + GDPRConsent.lang.allowAll;
		html += "               	</button> ";
		html += "               	<button type=\"button\" id=\"tarteaucitron-all-denied\" class=\"tarteaucitron-deny\" onclick=\"GDPRConsent.respondAll(false);\">";
		html += "                  		&#10007; " + GDPRConsent.lang.denyAll;
		html += "               	</button>";
		html += "             	</div>";
		html += "        	</div>";
		html += "		</div>";

		// La liste des Services
		html += "		<div id=\"tarteaucitron-services-list\">";
		html += "         <div class=\"clear\"></div>";
		if (GDPRConsent.parameters.mandatory === true) {
			html += "<div class=\"tarteaucitron-cookie-group\">";
			html += "	<div class=\"tarteaucitron-cookie-text\">";
			html += "   	<span class=\"tarteaucitron-h3\" role=\"heading\" aria-level=\"2\">" + GDPRConsent.lang.mandatoryTitle + "</span>";
			html += "		<span class=\"tarteaucitron-description\">" + GDPRConsent.lang.mandatoryText + "</span>";
			html += "	</div>";
			html += "	<div class=\"tarteaucitron-cookie-buttons\">";
			html += "       <button type=\"button\" class=\"tarteaucitron-allow solo\">";
			html += "           &#10003; " + GDPRConsent.lang.allow;
			html += "       </button> ";
			html += "	</div>";
			html += "</div>";
		}
		for (i = 0; i < cat.length; i += 1) {
			html += "         <li id=\"tarteaucitron-services-title_" + cat[i] + "\" class=\"tarteaucitron-hidden\">";
			html += "            <div class=\"tarteaucitron-title\">";
			html += "               <button type=\"button\" onclick=\"GDPRConsent.toggle('tarteaucitron-details" + cat[i] + "', 'tarteaucitron-info-box');return false\">&#10011; " + GDPRConsent.lang[cat[i]].title + "</button>";
			html += "            </div>";
			html += "            <div id=\"tarteaucitron-details" + cat[i] + "\" class=\"tarteaucitron-details tarteaucitron-info-box\">";
			html += "               " + GDPRConsent.lang[cat[i]].details;
			html += "            </div>";
			html += "         <ul id=\"tarteaucitron-services_" + cat[i] + "\"></ul></li>";
		}
		html += "             <li id=\"tarteaucitron-no-services-title\" class=\"tarteaucitron-line\">" + GDPRConsent.lang.noServices + "</li>";
		html += "         </ul>";
		html += "         <div class=\"tarteaucitron-hidden\" id=\"tarteaucitron-scrollbar-child\" style=\"height:20px;display:block\"></div>";
		html += "		</div>";
		html += "	</div>";
		html += "</div>";

		// For the Banner
		if (!GDPRConsent.parameters.AcceptAllCta) {
			html += "<div id=\"tarteaucitron-alert-big\" class=\"tarteaucitron-alert-big-bottom\">";
			if (GDPRConsent.lang.siteDisclaimerTitle !== "" && GDPRConsent.lang.siteDisclaimerMessage !== "") {
				html += "<div id=\"tarteaucitron-wrapper\">";
				html += "	<div id=\"tarteaucitron-disclaimer-texte\">";
				html += "		<span id=\"tarteaucitron-site-disclaimer-title\">";
				html += "			" + GDPRConsent.lang.siteDisclaimerTitle;
				html += "		</span>";
				html += "		<span id=\"tarteaucitron-site-disclaimer-message\">";
				html += "       	" + GDPRConsent.lang.siteDisclaimerMessage;
				html += "		</span>";
			}
			html += "   		<span id=\"tarteaucitron-disclaimer-alert\">";
			html += "       		" + GDPRConsent.lang.alertBigPrivacy;
			html += "   		</span>";
			html += "		</div>";

			html += "   	<div id=\"tarteaucitron-disclaimer-buttons\">";
			html += "       	<button type=\"button\" id=\"tarteaucitron-personalize\" onclick=\"GDPRConsent.openPanel();\">";
			html += "           	" + GDPRConsent.lang.personalize;
			html += "       	</button>";
			html += "   	</div>";
			html += "	</div>";
			html += "</div>";
		} else {
			html += "<div id=\"tarteaucitron-alert-big\" class=\"tarteaucitron-alert-big-bottom\">";
			if (GDPRConsent.lang.siteDisclaimerTitle !== "" && GDPRConsent.lang.siteDisclaimerMessage !== "") {
				html += "<div id=\"tarteaucitron-wrapper\">";
				html += "	<div id=\"tarteaucitron-disclaimer-texte\">";
				html += "		<span id=\"tarteaucitron-site-disclaimer-title\">";
				html += "			" + GDPRConsent.lang.siteDisclaimerTitle;
				html += "		</span>";
				html += "		<span id=\"tarteaucitron-site-disclaimer-message\">";
				html += "       	" + GDPRConsent.lang.siteDisclaimerMessage;
				html += "		</span>";
			}
			html += "   		<span id=\"tarteaucitron-disclaimer-alert\">";
			html += "	       	" + GDPRConsent.lang.alertBigPrivacy;
			html += "   		</span>";
			html += "		</div>";
			html += "   	<div id=\"tarteaucitron-disclaimer-buttons\">";
			html += "       	<button type=\"button\" id=\"tarteaucitron-continue\" onclick=\"GDPRConsent.respondAll(false);\">";
			html += "           	&rarr; " + GDPRConsent.lang.continue;
			html += "       	</button>";
			html += "			<div id=\"tarteaucitron-group-buttons\">";
			html += "       		<button type=\"button\" id=\"tarteaucitron-personalize\" onclick=\"GDPRConsent.respondAll(true);\">";
			html += "           		&#10003; " + GDPRConsent.lang.acceptAll;
			html += "       		</button>";
			html += "       		<button type=\"button\" id=\"tarteaucitron-close-alert\" onclick=\"GDPRConsent.openPanel();\">";
			html += "           		" + GDPRConsent.lang.personalize;
			html += "       		</button>";
			html += "			</div>";
			html += "   	</div>";
			html += "	</div>";
			html += "</div>";
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
			userInterface.openPanel(GDPRConsent);
		}
	},
	addService: function(serviceId) {
		"use strict";
		var html = "",
			s = GDPRConsent.services,
			service = s[serviceId],
			cookie = cookies.read(GDPRConsent.parameters),
			isDenied = (cookie.indexOf(service.key + "=false") >= 0),
			isAllowed = ((cookie.indexOf(service.key + "=true") >= 0) || (!service.needConsent && cookie.indexOf(service.key + "=false") < 0)),
			isResponded = (cookie.indexOf(service.key + "=false") >= 0 || cookie.indexOf(service.key + "=true") >= 0),
			isDNTRequested = (navigator.doNotTrack === "1" || navigator.doNotTrack === "yes" || navigator.msDoNotTrack === "1" || window.doNotTrack === "1");
		if (GDPRConsent.added[service.key] !== true) {
			GDPRConsent.added[service.key] = true;

			html += "<div id=\"" + service.key + "-line\" class=\"tarteaucitron-cookie-group\">";
			html += "   <div class=\"tarteaucitron-cookie-text\">";
			html += "       <span class=\"tarteaucitron-h3\" role=\"heading\" aria-level=\"3\">" + service.name + "</span>";
			html += "       <span id=\"tacCL" + service.key + "\" class=\"tarteaucitron-description\"></span>";
			if (GDPRConsent.parameters.moreInfoLink === true) {
				html += "       <a href=\"" + service.uri + "\" target=\"_blank\" rel=\"noreferrer noopener\" title=\"" + service.name + " " + GDPRConsent.lang.newWindow + "\">";
				html += "           " + GDPRConsent.lang.source;
				html += "       </a>";
			}
			html += "   </div>";
			html += "   <div class=\"tarteaucitron-cookie-buttons\">";
			html += "       <span id=\"" + service.key + "Allowed\" class=\"tarteaucitron-switch-state\" onclick=\"GDPRConsent.respond(this, event);\">" + GDPRConsent.lang.allow + "</span>";
			html += "       <div class=\"tarteaucitron-switch\" id=\"" + service.key + "Switch\" onclick=\"GDPRConsent.respond(this, event);\">";
			html += "			<button type=\"button\" class=\"tarteaucitron-switch-button\"></button>";
			html += "       </div> ";
			html += "       <span id=\"" + service.key + "Denied\" class=\"tarteaucitron-switch-state\" onclick=\"GDPRConsent.respond(this, event);\">" + GDPRConsent.lang.deny + "</span>";
			html += "   </div>";
			html += "</li>";

			css("tarteaucitron-services-title_" + service.type, "display", "block");

			if (document.getElementById("tarteaucitron-services_" + service.type) !== null) {
				document.getElementById("tarteaucitron-services_" + service.type).innerHTML += html;
			}

			css("tarteaucitron-no-services-title", "display", "none");

			userInterface.order(service.type, GDPRConsent);
		}

		if (isAllowed) {
			if (GDPRConsent.launch[service.key] !== true) {
				GDPRConsent.launch[service.key] = true;
				service.js();
				sendEvent(service.key + "_loaded");
			}
			GDPRConsent.state[service.key] = true;
		} else if (isDenied) {
			if (typeof service.fallback === "function") {
				service.fallback();
			}
			GDPRConsent.state[service.key] = false;
		} else if (!isResponded && isDNTRequested && GDPRConsent.handleBrowserDNTRequest) {
			cookies.create(service.key, "false", GDPRConsent.parameters);
			if (typeof service.fallback === "function") {
				service.fallback();
			}
			GDPRConsent.state[service.key] = false;
		} else if (!isResponded) {
			cookies.create(service.key, "wait", GDPRConsent.parameters);
			if (typeof service.fallback === "function") {
				service.fallback();
			}
			userInterface.openAlert();
		}

		cookies.checkCount(service.key, service, GDPRConsent.lang);
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
		userInterface.openPanel(GDPRConsent);
	},
	respondEffect: function(key, status) {
		userInterface.respondEffect(key, status, GDPRConsent);
	},
	respondAll: function(status) {
		userInterface.respondAll(status, GDPRConsent, GDPRConsent.parameters);
	},
	respond: function(el, evt) {
		userInterface.respond(el, GDPRConsent, GDPRConsent.parameters, evt);
	},
	activate: function(id, status) {
		userInterface.activate(id, status, GDPRConsent, GDPRConsent.parameters);
	},
	toggle: function(id, closeClass) {
		userInterface.toggle(id, closeClass);
	}
};

export default GDPRConsent;
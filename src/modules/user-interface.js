import { searchElements, css, addClass, removeClass } from "../utils/dom";
import { sendEvent } from "../utils/event";
import cookies from "./cookies";

// function jsSizing(type) {
// 	"use strict";
// 	var servicesHeight,
// 		mainHeight;

// 	if (type === "main") {
// 		// height of the services list container
// 		if (document.getElementById("tarteaucitron") !== null && document.getElementById("tarteaucitron-main-line") !== null) {
// 			// reset
// 			css("tarteaucitron-services", "height", "auto");

// 			// calculate
// 			mainHeight = document.getElementById("tarteaucitron").offsetHeight;

// 			// apply
// 			servicesHeight = mainHeight;
// 			css("tarteaucitron-services", "height", servicesHeight + "px");
// 			css("tarteaucitron-services", "overflow-x", "auto");
// 		}
// 	}
// }

function closePanel(GDPRConsentState) {
	"use strict";

	if (document.location.hash === GDPRConsentState.hashtag) {
		if (window.history) {
			window.history.replaceState("", document.title, window.location.pathname + window.location.search);
		} else {
			document.location.hash = "";
		}
	}
	css("tarteaucitron", "display", "none");

	searchElements(["tarteaucitron-info-box"], function(elem) {
		elem.style.display = "none";
	});

	if (GDPRConsentState.reloadThePage === true) {
		window.location.reload();
	} else {
		css("tarteaucitron-back", "display", "none");
	}
	if (document.getElementById("tarteaucitron-close-alert") !== null) {
		document.getElementById("tarteaucitron-close-alert").focus();
	}
	document.getElementsByTagName("body")[0].classList.remove("modal-open");

	sendEvent("tac.close_panel");
}

function openPanel(GDPRConsentState) {
	"use strict";

	var index;
	css("tarteaucitron", "display", "block");
	css("tarteaucitron-back", "display", "block");

	document.getElementById("tarteaucitron-close-panel").focus();
	document.getElementsByTagName("body")[0].classList.add("modal-open");

	for (index = 0; index < GDPRConsentState.job.length; index++) {
		if (GDPRConsentState.state[GDPRConsentState.job[index]] !== undefined) {
			respondEffect(GDPRConsentState.job[index], GDPRConsentState.state[GDPRConsentState.job[index]], GDPRConsentState);
		}
	}

	sendEvent("tac.open_panel");
}

function closeAlert() {
	"use strict";
	var c = "tarteaucitron";
	css(c + "-percentage", "display", "none");
	css(c + "-alert-big",   "display", "none");
	removeClass(c + "-root",   "tarteaucitron-before-visible");

	sendEvent("tac.close_alert");
}

function openAlert() {
	"use strict";
	var c = "tarteaucitron"
	css(c + "-percentage", "display", "block");
	css(c + "-alert-big",   "display", "block");
	addClass(c + "-root",   "tarteaucitron-before-visible");

	sendEvent("tac.open_alert");
}

function mouseXEvent(event) {
	var e = event;
	return e.clientX;
}

function respondEffect(key, choice, GDPRConsentState) {
	var switchBtn = document.getElementById(key),
		allowedState = document.getElementById(key + "Allowed"),
		deniedState = document.getElementById(key + "Denied"),
		index,
		cookieCounter = GDPRConsentState.job.length,
		nbAllowed = 0,
		nbDenied = 0;

	switchBtn.classList.remove("switch-denied");
	switchBtn.classList.remove("switch-allowed");
	allowedState.classList.remove("active");
	deniedState.classList.remove("active");
	
	// Style des switch
	if (choice === true) {
		switchBtn.classList.add("switch-allowed");
		switchBtn.children[0].innerHTML = "&#10003;";
		allowedState.classList.add("active");
	} else {
		switchBtn.classList.add("switch-denied");
		switchBtn.children[0].innerHTML = "&#10007;";
		deniedState.classList.add("active");
	}

	// Compter quels cookies ont été acceptés/refusés/répondus
	for (index = 0; index < GDPRConsentState.job.length; index++) {
		if (GDPRConsentState.state[GDPRConsentState.job[index]] !== undefined) {
			cookieCounter -= 1;
			if (GDPRConsentState.state[GDPRConsentState.job[index]] === true) {
				nbAllowed += 1;
			} else {
				nbDenied += 1;
			}
		}
	}

	// Si tous les cookies ont été répondus, je ferme le bandeau
	if (cookieCounter === 0) {
		closeAlert();
	}

	// Si tous les cookies ont été acceptés/refusés, je change le style des boutons
	if (nbAllowed === GDPRConsentState.job.length) {
		console.log("toutA");
		document.getElementById("tarteaucitron-all-denied").classList.remove("tarteaucitron-is-selected");
		document.getElementById("tarteaucitron-all-allowed").classList.add("tarteaucitron-is-selected");
	} else if (nbDenied === GDPRConsentState.job.length) {
		console.log("toutR");
		document.getElementById("tarteaucitron-all-allowed").classList.remove("tarteaucitron-is-selected");
		document.getElementById("tarteaucitron-all-denied").classList.add("tarteaucitron-is-selected");
	}

	// Compteur de cookies affiché sous le nom du cookie
	if (choice === true) {
		if (document.getElementById("tacCL" + key) !== null) {
			document.getElementById("tacCL" + key).innerHTML = "...";
		}
		setTimeout(function() {
			cookies.checkCount(key, GDPRConsentState.services[key], GDPRConsentState.lang);
		}, 2500);
	} else {
		cookies.checkCount(key, GDPRConsentState.services[key], GDPRConsentState.lang);
	}
}

function respondAll(status, GDPRConsentState, GDPRConsentParameters) {
	"use strict";
	var s = GDPRConsentState.services,
		service,
		key,
		index = 0;

	for (index = 0; index < GDPRConsentState.job.length; index += 1) {
		service = s[GDPRConsentState.job[index]];
		key = service.key;

		if (GDPRConsentState.state[key] !== status) {
			if (status === false && GDPRConsentState.launch[key] === true) {
				GDPRConsentState.reloadThePage = true;
			}
			if (GDPRConsentState.launch[key] !== true && status === true) {
				GDPRConsentState.launch[key] = true;
				GDPRConsentState.services[key].js();
			}
			GDPRConsentState.state[key] = status;
			cookies.create(key, status, GDPRConsentParameters);	
			respondEffect(key, status, GDPRConsentState);		
		}
	}
}

function respond(el, GDPRConsentState, GDPRConsentParameters) {
	"use strict";

	var key = el.id.replace(new RegExp("(Eng[0-9]+|Allow|Deni)ed", "g"), ""),
		// switchBtn = document.getElementById(key),
		status,
		mousePosition = mouseXEvent(event), 
		elPos = el.getBoundingClientRect();
	
	// Cas 1 : Je clique sur le switch
	if (el.classList.contains("tarteaucitron-switch")) {
		// Je regarde si il a déjà été activé ou refusé...
		if (GDPRConsentState.state[key] !== undefined) {
			if (el.classList.contains("switch-denied")) {
				status = true;
			} else {
				status = false;
			}
		} else if (mousePosition < (elPos.left) + ((el.clientWidth)/2)) {
			status = true;
		} else {
			status = false;
		}
	} 
	// Cas 2 : Je clique sur "Autoriser" ou "Interdire"
	else if (el.classList.contains("tarteaucitron-switch-state")) {
		// Je vérifie que je ne reclique pas sur la même valeur
		if ((el.id.includes("Allowed")) && (GDPRConsentState.state[key] !== true)) {
			status = true;
		} else if ((el.id.includes("Denied")) && (GDPRConsentState.state[key] !== false)) {
			status = false;
		} else {
			console.log("allo");
			return;
		}		
	}

	if ((status === true) && (GDPRConsentState.launch[key] !== true)) {
		GDPRConsentState.launch[key] = true;
		sendEvent(key + "_loaded");
		GDPRConsentState.services[key].js();
	}

	GDPRConsentState.state[key] = status;
	cookies.create(key, status, GDPRConsentParameters);
	respondEffect(key, status, GDPRConsentState);
}

function toggle(id, closeClass) {
	"use strict";
	var div = document.getElementById(id);

	if (div === null) {
		return;
	}

	if (closeClass !== undefined) {
		searchElements([closeClass], function(elem) {
			if (elem.id !== id) {
				elem.style.display = "none";
			}
		});
	}

	if (div.style.display !== "block") {
		div.style.display = "block";
	} else {
		div.style.display = "none";
	}
}

function order(id, GDPRConsentState) {
	"use strict";
	var main = document.getElementById("tarteaucitron-services_" + id);

	if (main === null) {
		return;
	}

	if (typeof Array.prototype.map === "function" && typeof Enumerable === "undefined") {
		Array.prototype.map.call(main.children, Object).sort(function(a, b) {
			if (GDPRConsentState.services[a.id.replace(/-line/g, "")].name > GDPRConsentState.services[b.id.replace(/-line/g, "")].name) { return 1; }
			if (GDPRConsentState.services[a.id.replace(/-line/g, "")].name < GDPRConsentState.services[b.id.replace(/-line/g, "")].name) { return -1; }
			return 0;
		}).forEach(function(element) {
			main.appendChild(element);
		});
	}
}

export default {
	// jsSizing: jsSizing,
	closePanel: closePanel,
	openPanel: openPanel,
	closeAlert: closeAlert,
	openAlert: openAlert,
	respondAll: respondAll,
	respond: respond,
	toggle: toggle,
	order: order
};
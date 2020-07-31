import { searchElements, css, addClass, removeClass } from "../utils/dom";
import { sendEvent } from "../utils/event";
import cookies from "./cookies";

function jsSizing(type) {
	"use strict";
	var scrollbarMarginRight = 10,
		scrollbarWidthParent,
		scrollbarWidthChild,
		servicesHeight,
		e = window,
		a = "inner",
		windowInnerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
		mainTop,
		mainHeight,
		closeButtonHeight;

	if (type === "main") {
		// get the real window width for media query
		if (window.innerWidth === undefined) {
			a = "client";
			e = document.documentElement || document.body;
		}

		// height of the services list container
		if (document.getElementById("tarteaucitron") !== null && document.getElementById("tarteaucitron-close-panel") !== null && document.getElementById("tarteaucitron-main-line-offset") !== null) {
			// reset
			css("tarteaucitron-services", "height", "auto");

			// calculate
			mainHeight = document.getElementById("tarteaucitron").offsetHeight;
			closeButtonHeight = document.getElementById("tarteaucitron-close-panel").offsetHeight;

			// apply
			servicesHeight = (mainHeight - closeButtonHeight + 2);
			css("tarteaucitron-services", "height", servicesHeight + "px");
			css("tarteaucitron-services", "overflow-x", "auto");
		}

		// align the main allow/deny button depending on scrollbar width
		if (document.getElementById("tarteaucitron-services") !== null && document.getElementById("tarteaucitronScrollbarChild") !== null) {
			// media query
			if (e[a + "Width"] <= 479) {
				css("tarteaucitron-scrollbar-adjust", "marginLeft", "11px");
			} else if (e[a + "Width"] <= 767) {
				scrollbarMarginRight = 12;
			}

			scrollbarWidthParent = document.getElementById("tarteaucitron-services").offsetWidth;
			scrollbarWidthChild = document.getElementById("tarteaucitronScrollbarChild").offsetWidth;
			css("tarteaucitron-scrollbar-adjust", "marginRight", ((scrollbarWidthParent - scrollbarWidthChild) + scrollbarMarginRight) + "px");
		}

		// center the main panel
		if (document.getElementById("tarteaucitron") !== null) {
			// media query
			if (e[a + "Width"] <= 767) {
				mainTop = 0;
			} else {
				mainTop = ((windowInnerHeight - document.getElementById("tarteaucitron").offsetHeight) / 2) - 21;
			}

			if (document.getElementById("tarteaucitron-main-line-offset") !== null) {
				if (document.getElementById("tarteaucitron").offsetHeight < (windowInnerHeight / 2)) {
					mainTop -= document.getElementById("tarteaucitron-main-line-offset").offsetHeight;
				}
			}

			// correct
			if (mainTop < 0) {
				mainTop = 0;
			}

			// apply
			css("tarteaucitron", "top", mainTop + "px");
		}
	}
}

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

	searchElements(["tarteaucitron-infoBox"], function(elem) {
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

function openPanel() {
	"use strict";

	css("tarteaucitron", "display", "block");
	css("tarteaucitron-back", "display", "block");

	document.getElementById("tarteaucitron-close-panel").focus();
	document.getElementsByTagName("body")[0].classList.add("modal-open");
	jsSizing("main");

	sendEvent("tac.open_panel");
}

function closeAlert() {
	"use strict";
	var c = "tarteaucitron";
	css(c + "-percentage", "display", "none");
	css(c + "-alert-big",   "display", "none");
	removeClass(c + "Root",   "tarteaucitronBeforeVisible");
	jsSizing("box");

	sendEvent("tac.close_alert");
}

function openAlert() {
	"use strict";
	var c = "tarteaucitron";
	css(c + "-percentage", "display", "block");
	css(c + "-alert-big",   "display", "block");
	addClass(c + "Root",   "tarteaucitronBeforeVisible");

	sendEvent("tac.open_alert");
}

function color(key, status, GDPRConsentState) {
	"use strict";
	var c = "tarteaucitron",
		nbDenied = 0,
		nbPending = 0,
		nbAllowed = 0,
		sum = GDPRConsentState.job.length,
		index;

	if (status === true) {
		document.getElementById(key + "-line").classList.add("tarteaucitron-is-allowed");
		document.getElementById(key + "-line").classList.remove("tarteaucitron-is-denied");
	} else if (status === false) {
		document.getElementById(key + "-line").classList.remove("tarteaucitron-is-allowed");
		document.getElementById(key + "-line").classList.add("tarteaucitron-is-denied");
	}

	// check if all services are allowed
	for (index = 0; index < sum; index += 1) {
		if (GDPRConsentState.state[GDPRConsentState.job[index]] === false) {
			nbDenied += 1;
		} else if (GDPRConsentState.state[GDPRConsentState.job[index]] === undefined) {
			nbPending += 1;
		} else if (GDPRConsentState.state[GDPRConsentState.job[index]] === true) {
			nbAllowed += 1;
		}
	}

	css(c + "-dot-green", "width", ((100 / sum) * nbAllowed) + "%");
	css(c + "-dot-yellow", "width", ((100 / sum) * nbPending) + "%");
	css(c + "-dot-red", "width", ((100 / sum) * nbDenied) + "%");

	if (nbDenied === 0 && nbPending === 0) {
		removeClass(c + "-all-denied", c + "-is-selected");
		addClass(c + "-all-allowed", c + "-is-selected");

		addClass(c + "-main-line-offset", c + "-is-allowed");
		removeClass(c + "-main-line-offset", c + "-is-denied");
	} else if (nbAllowed === 0 && nbPending === 0) {
		removeClass(c + "-all-allowed", c + "-is-selected");
		addClass(c + "-all-denied", c + "-is-selected");

		removeClass(c + "-main-line-offset", c + "-is-allowed");
		addClass(c + "-main-line-offset", c + "-is-denied");
	} else {
		removeClass(c + "-all-allowed", c + "-is-selected");
		removeClass(c + "-all-denied", c + "-is-selected");

		removeClass(c + "-main-line-offset", c + "-is-allowed");
		removeClass(c + "-main-line-offset", c + "-is-denied");
	}

	// close the alert if all service have been reviewed
	if (nbPending === 0) {
		closeAlert();
	}

	if (GDPRConsentState.services[key].cookies.length > 0 && status === false) {
		cookies.purge(GDPRConsentState.services[key].cookies);
	}

	if (status === true) {
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
			color(key, status, GDPRConsentState);
		}
	}
}

function respond(el, status, GDPRConsentState, GDPRConsentParameters) {
	"use strict";
	var key = el.id.replace(new RegExp("(Eng[0-9]+|Allow|Deni)ed", "g"), "");

	// return if same state
	if (GDPRConsentState.state[key] === status) {
		return;
	}

	if (status === false && GDPRConsentState.launch[key] === true) {
		GDPRConsentState.reloadThePage = true;
	}

	// if not already launched... launch the service
	if (status === true) {
		if (GDPRConsentState.launch[key] !== true) {
			GDPRConsentState.launch[key] = true;
			sendEvent(key + "_loaded");
			GDPRConsentState.services[key].js();
		}
	}
	GDPRConsentState.state[key] = status;
	cookies.create(key, status, GDPRConsentParameters);
	color(key, status, GDPRConsentState);
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
	jsSizing: jsSizing,
	closePanel: closePanel,
	openPanel: openPanel,
	closeAlert: closeAlert,
	openAlert: openAlert,
	color: color,
	respondAll: respondAll,
	respond: respond,
	toggle: toggle,
	order: order
};
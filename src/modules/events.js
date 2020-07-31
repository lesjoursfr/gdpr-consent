import userInterface from "./user-interface";

function keydownEvent(isOldBrowser, evt) {
	if (evt.keyCode === 27) {
		userInterface.closePanel();
	}
}

function hashchangeEvent(GDPRConsentParameters) {
	if (document.location.hash === GDPRConsentParameters.hashtag) {
		userInterface.openPanel();
	}
}

function resizeEvent() {
	var tacElem = document.getElementById("tarteaucitron");

	if (tacElem && tacElem.style.display === "block") {
		userInterface.jsSizing("main");
	}
}

function scrollEvent(GDPRConsentState, GDPRConsentParameters, lang) {
	var scrollPos = window.pageYOffset || document.documentElement.scrollTop,
		heightPosition,
		tacPercentage = document.getElementById("tarteaucitron-percentage"),
		tacAlertBig = document.getElementById("tarteaucitron-alert-big");

	if (tacAlertBig && !GDPRConsentParameters.highPrivacy) {
		if (tacAlertBig.style.display === "block") {
			heightPosition = tacAlertBig.offsetHeight + "px";

			if (scrollPos > (screen.height * 2)) {
				userInterface.respondAll(true, GDPRConsentState, GDPRConsentParameters);
			} else if (scrollPos > (screen.height / 2)) {
				document.getElementById("tarteaucitron-disclaimer-alert").innerHTML = "<strong>" + lang.alertBigScroll + "</strong> " + lang.alertBig;
			}

			if (tacPercentage) {
				tacPercentage.style.bottom = heightPosition;
				tacPercentage.style.width = ((100 / (screen.height * 2)) * scrollPos) + "%";
			}
		}
	}
}

export default {
	keydownEvent: keydownEvent,
	hashchangeEvent: hashchangeEvent,
	resizeEvent: resizeEvent,
	scrollEvent: scrollEvent
};
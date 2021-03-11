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
		// userInterface.jsSizing("main");
	}
}

export default {
	keydownEvent: keydownEvent,
	hashchangeEvent: hashchangeEvent,
	resizeEvent: resizeEvent,
};
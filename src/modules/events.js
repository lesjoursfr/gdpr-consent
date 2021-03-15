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

export default {
	keydownEvent: keydownEvent,
	hashchangeEvent: hashchangeEvent
};
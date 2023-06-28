import userInterface from "./user-interface";

function keydownEvent(GDPRConsent, evt) {
  if (evt.keyCode === 27) {
    userInterface.closePanel(GDPRConsent);
  }
}

function hashchangeEvent(GDPRConsent) {
  if (document.location.hash === GDPRConsent.parameters.hashtag) {
    userInterface.openPanel(GDPRConsent);
  }
}

export default {
  keydownEvent,
  hashchangeEvent,
};

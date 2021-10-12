import userInterface from './user-interface';

function keydownEvent (isOldBrowser, evt) {
  if (evt.keyCode === 27) {
    userInterface.closePanel();
  }
}

function hashchangeEvent (GDPRConsent) {
  if (document.location.hash === GDPRConsent.parameters.hashtag) {
    userInterface.openPanel(GDPRConsent);
  }
}

export default {
  keydownEvent: keydownEvent,
  hashchangeEvent: hashchangeEvent
};

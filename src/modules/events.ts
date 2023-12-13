import { GDPRConsentState } from "../interfaces/index.js";
import { closePanel, openPanel } from "./user-interface.js";

export function keydownEvent(gdprConsentState: GDPRConsentState, evt: KeyboardEvent): void {
  if (evt.code === "Escape") {
    closePanel(gdprConsentState);
  }
}

export function hashchangeEvent(gdprConsentState: GDPRConsentState): void {
  if (document.location.hash === gdprConsentState.parameters.hashtag) {
    openPanel(gdprConsentState);
  }
}

import { addScript } from "../utils/dom";

export default (GDPRConsentUser) => ({
  key: "googletagmanager",
  type: "api",
  name: "Google Tag Manager",
  uri: "https://policies.google.com/privacy",
  needConsent: true,
  lazyConsent: false,
  cookies: [
    "_ga",
    "_gat",
    "__utma",
    "__utmb",
    "__utmc",
    "__utmt",
    "__utmz",
    "__gads",
    "_drt_",
    "FLC",
    "exchange_uid",
    "id",
    "fc",
    "rrs",
    "rds",
    "rv",
    "uid",
    "UIDR",
    "UID",
    "clid",
    "ipinfo",
    "acs",
  ],
  js: function () {
    "use strict";
    if (GDPRConsentUser.googletagmanagerId === undefined) {
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js",
    });
    addScript("https://www.googletagmanager.com/gtm.js?id=" + GDPRConsentUser.googletagmanagerId);
  },
});

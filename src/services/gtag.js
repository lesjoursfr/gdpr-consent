/* globals gtag: true */
import { addScript } from "../utils/dom";

export default (GDPRConsentUser) => ({
  key: "gtag",
  type: "analytic",
  name: "Google Analytics (GA4)",
  uri: "https://policies.google.com/privacy",
  needConsent: true,
  lazyConsent: false,
  cookies: (function () {
    const googleIdentifier = GDPRConsentUser.gtagUa;
    let tagUaCookie = "_gat_gtag_" + googleIdentifier;
    let tagGCookie = "_ga_" + googleIdentifier;

    tagUaCookie = tagUaCookie.replace(/-/g, "_");
    tagGCookie = tagGCookie.replace(/G-/g, "");

    return [
      "_ga",
      "_gat",
      "_gid",
      "__utma",
      "__utmb",
      "__utmc",
      "__utmt",
      "__utmz",
      tagUaCookie,
      tagGCookie,
      "_gcl_au",
    ];
  })(),
  js: function () {
    "use strict";
    window.dataLayer = window.dataLayer || [];
    addScript("https://www.googletagmanager.com/gtag/js?id=" + GDPRConsentUser.gtagUa, {}, function () {
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      gtag("js", new Date());

      if (GDPRConsentUser.gtagInitOptions) {
        gtag("config", GDPRConsentUser.gtagUa, GDPRConsentUser.gtagInitOptions);
      } else {
        gtag("config", GDPRConsentUser.gtagUa);
      }

      if (typeof GDPRConsentUser.gtagMore === "function") {
        GDPRConsentUser.gtagMore();
      }
    });
  },
});

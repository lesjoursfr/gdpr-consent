import { addScript } from "../utils/dom";

export default (GDPRConsentUser) => ({
  key: "subscribewithgoogle",
  type: "other",
  name: "Subscribe with Google",
  uri: "https://policies.google.com/technologies/cookies#types-of-cookies",
  needConsent: true,
  lazyConsent: true,
  cookies: [],
  js: function () {
    "use strict";

    if (typeof GDPRConsentUser.subscribewithgoogleMore === "function") {
      addScript("https://news.google.com/swg/js/v1/swg.js", { "subscriptions-control": "manual" }, function () {
        GDPRConsentUser.subscribewithgoogleMore();
      });
    } else {
      addScript("https://news.google.com/swg/js/v1/swg.js");
    }
  },
});

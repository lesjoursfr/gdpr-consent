import { GDPRConsentUser, ServiceInterface, ServiceLoader } from "../interfaces";
import { addScript } from "../utils";

export const subscribewithgoogle = ((user: GDPRConsentUser): ServiceInterface => {
  return {
    key: "subscribewithgoogle",
    type: "other",
    name: "Subscribe with Google",
    uri: "https://policies.google.com/technologies/cookies#types-of-cookies",
    needConsent: true,
    lazyConsent: true,
    cookies: [],
    js: function () {
      if (typeof user.subscribewithgoogleMore === "function") {
        addScript("https://news.google.com/swg/js/v1/swg.js", { "subscriptions-control": "manual" }, function () {
          (user.subscribewithgoogleMore as () => void)();
        });
      } else {
        addScript("https://news.google.com/swg/js/v1/swg.js");
      }
    },
  };
}) as ServiceLoader;

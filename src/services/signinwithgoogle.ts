import { GDPRConsentUser, ServiceInterface, ServiceLoader } from "../interfaces/index.js";
import { addScript } from "../utils/index.js";

export const signinwithgoogle = ((user: GDPRConsentUser): ServiceInterface => {
  return {
    key: "signinwithgoogle",
    type: "other",
    name: "Sign In with Google",
    uri: "https://policies.google.com/technologies/cookies#types-of-cookies",
    needConsent: true,
    lazyConsent: true,
    cookies: [],
    js: function () {
      if (typeof user.signinwithgoogleMore === "function") {
        addScript("https://accounts.google.com/gsi/client", undefined, function () {
          (user.signinwithgoogleMore as () => void)();
        });
      } else {
        addScript("https://accounts.google.com/gsi/client");
      }
    },
  };
}) as ServiceLoader;

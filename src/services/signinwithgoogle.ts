import { ServiceInterface, ServiceLoader } from "../interfaces/index.js";
import { addScript } from "../utils/index.js";

export const signinwithgoogle = ((): ServiceInterface => {
  return {
    key: "signinwithgoogle",
    type: "other",
    name: "Sign In with Google",
    uri: "https://policies.google.com/technologies/cookies#types-of-cookies",
    needConsent: true,
    lazyConsent: true,
    cookies: [],
    js: function () {
      addScript("https://accounts.google.com/gsi/client");
    },
  };
}) as ServiceLoader;

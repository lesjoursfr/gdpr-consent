import { addScript } from "../utils/dom";

export default () => ({
  key: "signinwithgoogle",
  type: "other",
  name: "Sign In with Google",
  uri: "https://policies.google.com/technologies/cookies#types-of-cookies",
  needConsent: true,
  lazyConsent: true,
  cookies: [],
  js: function () {
    "use strict";
    addScript("https://accounts.google.com/gsi/client");
  },
});

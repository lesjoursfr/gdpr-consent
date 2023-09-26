import { addScript } from "../utils/dom";

export default () => ({
  key: "signinwithapple",
  type: "other",
  name: "Sign In with Apple",
  uri: "https://www.apple.com/legal/privacy/en-ww/cookies/",
  needConsent: true,
  lazyConsent: true,
  cookies: [],
  js: function () {
    "use strict";
    addScript("https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js");
  },
});

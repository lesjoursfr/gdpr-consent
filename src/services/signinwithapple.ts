import { ServiceInterface, ServiceLoader } from "../interfaces/index.js";
import { addScript } from "../utils/index.js";

export const signinwithapple = ((): ServiceInterface => {
  return {
    key: "signinwithapple",
    type: "other",
    name: "Sign In with Apple",
    uri: "https://www.apple.com/legal/privacy/en-ww/cookies/",
    needConsent: true,
    lazyConsent: true,
    cookies: [],
    js: function () {
      addScript("https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js");
    },
  };
}) as ServiceLoader;

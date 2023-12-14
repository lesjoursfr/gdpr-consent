import { ServiceInterface, ServiceLoader } from "../interfaces/index.js";
import { getLocale } from "../languages/index.js";
import { addScript } from "../utils/index.js";

export const facebook = ((): ServiceInterface => {
  return {
    key: "facebook",
    type: "social",
    name: "Facebook",
    uri: "https://www.facebook.com/privacy/policies/cookies/",
    needConsent: true,
    lazyConsent: false,
    cookies: ["xs", "sb", "fr", "datr", "dpr", "c_user"],
    js: function () {
      addScript("//connect.facebook.net/" + getLocale() + "/sdk.js", { id: "facebook-jssdk" });
    },
  };
}) as ServiceLoader;

import { ServiceInterface, ServiceLoader } from "../interfaces";
import { getLocale } from "../languages";
import { addScript } from "../utils";

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

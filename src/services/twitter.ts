import { ServiceInterface, ServiceLoader } from "../interfaces";
import { addScript } from "../utils";

export const twitter = ((): ServiceInterface => {
  return {
    key: "twitter",
    type: "social",
    name: "X (formerly Twitter)",
    uri: "https://support.twitter.com/articles/20170514",
    needConsent: true,
    lazyConsent: false,
    cookies: [],
    js: function () {
      addScript("//platform.twitter.com/widgets.js", { id: "twitter-wjs" });
    },
  };
}) as ServiceLoader;

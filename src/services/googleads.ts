/* eslint-disable prefer-rest-params */
import { GDPRConsentUser, ServiceInterface, ServiceLoader } from "../interfaces/index.js";
import { addScript } from "../utils/index.js";

type GTagFunctionType = (...args: unknown[]) => unknown;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GTagFunctionType;
  }
}

export const googleads = ((user: GDPRConsentUser): ServiceInterface => {
  const googleIdentifier = user.googleadsId;
  let tagUaCookie = "_gat_gtag_" + googleIdentifier;
  let tagGCookie = "_ga_" + googleIdentifier;

  tagUaCookie = tagUaCookie.replace(/-/g, "_");
  tagGCookie = tagGCookie.replace(/G-/g, "");

  return {
    key: "googleads",
    type: "analytic",
    name: "Google Ads",
    uri: "https://policies.google.com/privacy",
    needConsent: true,
    lazyConsent: false,
    cookies: [
      "_ga",
      "_gat",
      "_gid",
      "__utma",
      "__utmb",
      "__utmc",
      "__utmt",
      "__utmz",
      tagUaCookie,
      tagGCookie,
      "_gcl_au",
    ],
    js: function () {
      window.dataLayer = window.dataLayer || [];
      addScript("https://www.googletagmanager.com/gtag/js?id=" + user.googleadsId, {}, function () {
        window.gtag = function gtag() {
          window.dataLayer!.push(arguments as unknown as unknown[]);
        };
        window.gtag("js", new Date());

        if (user.googleadsInitOptions) {
          window.gtag("config", user.googleadsId, user.googleadsInitOptions);
        } else {
          window.gtag("config", user.googleadsId);
        }

        if (typeof user.googleadsMore === "function") {
          user.googleadsMore();
        }
      });
    },
  };
}) as ServiceLoader;

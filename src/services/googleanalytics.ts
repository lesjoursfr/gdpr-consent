/* eslint-disable prefer-rest-params */
import { GDPRConsentUser, ServiceInterface, ServiceLoader } from "../interfaces";
import { addScript } from "../utils";

type GTagFunctionType = (...args: unknown[]) => unknown;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GTagFunctionType;
  }
}

export const googleanalytics = ((user: GDPRConsentUser): ServiceInterface => {
  return {
    key: "googleanalytics",
    type: "analytic",
    name: "Google Analytics (GA4)",
    uri: "https://policies.google.com/privacy",
    needConsent: true,
    lazyConsent: false,
    cookies: (function () {
      const googleIdentifier = user.gtagUa;
      let tagUaCookie = "_gat_gtag_" + googleIdentifier;
      let tagGCookie = "_ga_" + googleIdentifier;

      tagUaCookie = tagUaCookie.replace(/-/g, "_");
      tagGCookie = tagGCookie.replace(/G-/g, "");

      return [
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
      ];
    })(),
    js: function () {
      window.dataLayer = window.dataLayer || [];
      addScript("https://www.googletagmanager.com/gtag/js?id=" + user.googleanalyticsUa, {}, function () {
        window.gtag = function gtag() {
          window.dataLayer!.push(arguments as unknown as unknown[]);
        };
        window.gtag("js", new Date());

        if (user.googleanalyticsInitOptions) {
          window.gtag("config", user.googleanalyticsUa, user.googleanalyticsInitOptions);
        } else {
          window.gtag("config", user.googleanalyticsUa);
        }

        if (typeof user.googleanalyticsMore === "function") {
          user.googleanalyticsMore();
        }
      });
    },
  };
}) as ServiceLoader;

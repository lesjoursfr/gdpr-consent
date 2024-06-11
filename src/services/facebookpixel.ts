/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-spread */
import { GDPRConsentUser, ServiceInterface, ServiceLoader } from "../interfaces/index.js";
import { addScript } from "../utils/index.js";

type FacebookPixelFunctionType = (...args: unknown[]) => unknown;

type FacebookPixelType = FacebookPixelFunctionType & {
  push: FacebookPixelFunctionType;
  callMethod: FacebookPixelFunctionType;
  loaded: boolean;
  version: string;
  queue: Array<unknown[]>;
};

declare global {
  interface Window {
    _fbq?: FacebookPixelType;
    fbq?: FacebookPixelType;
  }
}

export const facebookpixel = ((user: GDPRConsentUser): ServiceInterface => {
  return {
    key: "facebookpixel",
    type: "ads",
    name: "Facebook Pixel",
    uri: "https://www.facebook.com/privacy/policies/cookies/",
    needConsent: true,
    lazyConsent: false,
    cookies: ["datr", "fr", "reg_ext_ref", "reg_fb_gate", "reg_fb_ref", "sb", "wd", "x-src", "_fbp"],
    js: function () {
      if (window.fbq) {
        return;
      }
      const n = (window.fbq = function () {
        if (n.callMethod) {
          n.callMethod.apply(n, arguments as unknown as unknown[]);
        } else {
          n.queue.push(arguments as unknown as unknown[]);
        }
      } as unknown as FacebookPixelType);
      if (!window._fbq) {
        window._fbq = n;
      }
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      addScript("https://connect.facebook.net/en_US/fbevents.js", { id: "facebook-fbevents" }, function () {
        window.fbq!("init", user.fbPixelId);
        window.fbq!("track", "PageView");

        if (typeof user.facebookpixelMore === "function") {
          user.facebookpixelMore();
        }
      });
    },
  };
}) as ServiceLoader;

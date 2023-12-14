import { GDPRConsentUser, ServiceInterface } from "../interfaces/index.js";
import { facebook } from "./facebook.js";
import { facebookpixel } from "./facebookpixel.js";
import { googleanalytics } from "./googleanalytics.js";
import { googletagmanager } from "./googletagmanager.js";
import { signinwithapple } from "./signinwithapple.js";
import { signinwithgoogle } from "./signinwithgoogle.js";
import { subscribewithgoogle } from "./subscribewithgoogle.js";
import { twitter } from "./twitter.js";
import { vimeo } from "./vimeo.js";
import { youtube } from "./youtube.js";

export {
  facebook,
  facebookpixel,
  googleanalytics,
  googletagmanager,
  signinwithapple,
  signinwithgoogle,
  subscribewithgoogle,
  twitter,
  vimeo,
  youtube,
};

export function getServices(user: GDPRConsentUser): { [key: string]: ServiceInterface } {
  return {
    facebook: facebook(user),
    facebookpixel: facebookpixel(user),
    googletagmanager: googletagmanager(user),
    googleanalytics: googleanalytics(user),
    signinwithapple: signinwithapple(user),
    signinwithgoogle: signinwithgoogle(user),
    subscribewithgoogle: subscribewithgoogle(user),
    twitter: twitter(user),
    vimeo: vimeo(user),
    youtube: youtube(user),
  };
}

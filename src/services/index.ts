import { GDPRConsentUser, ServiceInterface } from "../interfaces";
import { facebook } from "./facebook";
import { facebookpixel } from "./facebookpixel";
import { googleanalytics } from "./googleanalytics";
import { googletagmanager } from "./googletagmanager";
import { signinwithapple } from "./signinwithapple";
import { signinwithgoogle } from "./signinwithgoogle";
import { subscribewithgoogle } from "./subscribewithgoogle";
import { twitter } from "./twitter";
import { vimeo } from "./vimeo";
import { youtube } from "./youtube";

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

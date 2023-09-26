import facebook from "./facebook";
import facebookpixel from "./facebookpixel";
import googletagmanager from "./googletagmanager";
import gtag from "./gtag";
import signinwithapple from "./signinwithapple";
import signinwithgoogle from "./signinwithgoogle";
import subscribewithgoogle from "./subscribewithgoogle";
import twitter from "./twitter";
import vimeo from "./vimeo";
import youtube from "./youtube";

export default {
  getServices: (GDPRConsentUser) => {
    return {
      facebook: facebook(GDPRConsentUser),
      facebookpixel: facebookpixel(GDPRConsentUser),
      googletagmanager: googletagmanager(GDPRConsentUser),
      gtag: gtag(GDPRConsentUser),
      signinwithapple: signinwithapple(GDPRConsentUser),
      signinwithgoogle: signinwithgoogle(GDPRConsentUser),
      subscribewithgoogle: subscribewithgoogle(GDPRConsentUser),
      twitter: twitter(GDPRConsentUser),
      vimeo: vimeo(GDPRConsentUser),
      youtube: youtube(GDPRConsentUser),
    };
  },
};

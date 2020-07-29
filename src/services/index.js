import facebook from "./facebook";
import googletagmanager from "./googletagmanager";
import gtag from "./gtag";
import twitter from "./twitter";

export default {
	getServices: (GDPRConsentUser) => {
		return {
			facebook: facebook(GDPRConsentUser),
			googletagmanager: googletagmanager(GDPRConsentUser),
			gtag: gtag(GDPRConsentUser),
			twitter: twitter(GDPRConsentUser)
		};
	}
};
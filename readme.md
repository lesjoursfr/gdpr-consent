[![NPM version](https://badge.fury.io/js/gdpr-consent.svg)](http://badge.fury.io/js/gdpr-consent)
[![QC Checks](https://github.com/lesjoursfr/gdpr-consent/actions/workflows/quality-control.yml/badge.svg)](https://github.com/lesjoursfr/gdpr-consent/actions/workflows/quality-control.yml)

# gdpr-consent.js

Comply to the european cookie law.
Inspired by [AmauriC/tarteaucitron.js](https://github.com/AmauriC/tarteaucitron.js/)

# What is this script?

The european cookie law regulates the management of cookies and you should ask your visitors their consent before exposing them to third party services.

Clearly this script will:

-   Disable all services by default,
-   Display a banner on the first page view and a small one on other pages,
-   Display a panel to allow or deny each services one by one,
-   Activate services on the second page view if not denied,
-   Store the consent in a cookie for 365 days.

# How to use

```html
<link rel="stylesheet" href="gdpr-consent.css" />
<script type="text/javascript" src="gdpr-consent.js"></script>
<script type="text/javascript">
	GDPRConsent.init({
		hashtag: "#tarteaucitron" /* Open the panel with this hashtag */,
		cookieName: "tarteaucitron" /* Cookie name */,
		timeExpire: 31536000000 /* Cookie expiration time */,
		acceptAllCta: true /* Show the accept all button*/,
		moreInfoLink: true /* Show more info link */,
		mandatory: false /* Show a message about mandatory cookies */,
		websiteName: "Les Jours" /* The name of the Website */,
		siteDisclaimerTitle: "«&nbsp;Le site qui raconte l’actualité en séries&nbsp;»" /* A title for the disclaimer message */,
		siteDisclaimerMessage: '<i>Les&nbsp;Jours</i> sont un média <a href="/les-jours-c-quoi/">indépendant et sans pub</a>.', /* The content of the disclaimer message */,
	});
</script>
```

# Add services

```html
<script type="text/javascript">
	/* Initialize gdprconsent.js job array */
	GDPRConsent.job = GDPRConsent.job || [];

	/* Add Google Tag Manager */
	GDPRConsent.user.googletagmanagerId = "GTM-P5GRMRT";
	GDPRConsent.job.push("googletagmanager");

	/* Add Google Analytics (gtag.js) */
	GDPRConsent.user.gtagUa = "UA-59581990-1";
	GDPRConsent.user.gtagInitOptions = { send_page_view: false, optimize_id: "GTM-W4WVC25" };
	GDPRConsent.job.push("gtag");

	/* Add Socials Sharing Services : Twitter & Facebook */
	GDPRConsent.job.push("twitter");
	window.fbAsyncInit = function () {
		FB.init({ appId: "1716167151957741", status: true, version: "v3.0" });
	};
	GDPRConsent.job.push("facebook");

	/* Add Ads Services : Facebook Pixel */
	GDPRConsent.user.fbPixelId = "1415993661766511";
	GDPRConsent.job.push("facebookpixel");

	/* Add Vidéos : Vimeo & YT */
	GDPRConsent.job.push("vimeo");
	GDPRConsent.job.push("youtube");

	/* Add Sign-in with */
	GDPRConsent.job.push("signinwithapple");
	GDPRConsent.job.push("signinwithgoogle");

	/* Add Subscribe with Google */
	GDPRConsent.job.push("subscribewithgoogle");
</script>
```

[![NPM version](https://badge.fury.io/js/gdpr-consent.svg)](http://badge.fury.io/js/gdpr-consent)
[![QC Checks](https://github.com/lesjoursfr/gdpr-consent/actions/workflows/quality-control.yml/badge.svg)](https://github.com/lesjoursfr/gdpr-consent/actions/workflows/quality-control.yml)

# gdpr-consent.js

Comply to the european cookie law.
Inspired by [AmauriC/tarteaucitron.js](https://github.com/AmauriC/tarteaucitron.js/)

# What is this script?

The european cookie law regulates the management of cookies and you should ask your visitors their consent before exposing them to third party services.

Clearly this script will:

- Disable all services by default,
- Display a banner on the first page view and a small one on other pages,
- Display a panel to allow or deny each services one by one,
- Activate services on the second page view if not denied,
- Store the consent in a cookie for 365 days.

# How to use

## Pre-built version

### Files

The prebuilt CSS/JS files can be found in the build folder.

```
build/gdpr-consent.css
build/gdpr-consent.js
```

### HTML

To add the GDPR banner you need to add these lines at the end of the `<head>` section

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
		mandatory: false /* Don't show a message about mandatory cookies */,
		preferLocalStorage: true /* Use the localStorage to save responses if it's available */,
		websiteName: "Les Jours" /* The name of the Website */,
		siteDisclaimerTitle: "«&nbsp;Le site qui raconte l’actualité en séries&nbsp;»" /* A title for the disclaimer message */,
		siteDisclaimerMessage: '<i>Les&nbsp;Jours</i> sont un média <a href="/les-jours-c-quoi/">indépendant et sans pub</a>.', /* The content of the disclaimer message */,
	});
</script>
```

You can then configure your services by adding these lines at the end of the `<body>` section

```html
<script type="text/javascript">
	/* Initialize gdprconsent.js job array */
	GDPRConsent.job = GDPRConsent.job || [];

	/* Add Google Tag Manager */
	GDPRConsent.user.googletagmanagerId = "GTM-P5GRMRT";
	GDPRConsent.job.push("googletagmanager");

	/* Add Google Analytics (gtag.js) */
	GDPRConsent.user.googleanalyticsUa = "UA-59581990-1";
	GDPRConsent.user.googleanalyticsInitOptions = {
		send_page_view: false,
		optimize_id: "GTM-W4WVC25",
	};
	GDPRConsent.job.push("googleanalytics");

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

## Custom bundler

You can also use this module with you own bundler.

### Custom CSS

You can change the style of the banner with these variables.

```scss
@use "node_modules/gdpr-consent/src/css/gdpr-consent" with (
	/* Override GDPR Consent variables */
		$gdprcst-font-family-title: (
			"Archer SSm A",
			"Archer SSm B",
			"Helvetica Neue",
			helvetica,
			arial,
			sans-serif
		),
	$gdprcst-font-family-text: (
		"proxima-nova",
		"Helvetica Neue",
		helvetica,
		arial,
		sans-serif
	),
	$gdprcst-color-light: #fff,
	$gdprcst-color-dark: #414141,
	$gdprcst-color-mid: #c83e2c,
	$gdprcst-shadow-color: rgb(87 87 87 / 25%)
);
```

### Custom services & languages

You can use the `GDPRConsent.withLanguages` & `GDPRConsent.withServices` to change the available set of languages & services.
These methods allow you to create custom builds of this module with more or less elements.

```js
import { GDPRConsent, languages, services } from "gdpr-consent";

// Load languages
const { getLanguages } = languages;
GDPRConsent.withLanguages(getLanguages);

// Load services
const { twitter, facebook, youtube, vimeo } = services;
GDPRConsent.withServices((gdprConsentUser) => {
	return {
		twitter: twitter(gdprConsentUser),
		facebook: facebook(gdprConsentUser),
		youtube: youtube(gdprConsentUser),
		vimeo: vimeo(gdprConsentUser),
	};
});
```

[![NPM version](https://badge.fury.io/js/gdpr-consent.svg)](http://badge.fury.io/js/gdpr-consent)
[![Build Status](https://travis-ci.org/lesjoursfr/gdpr-consent.svg?branch=master)](https://travis-ci.org/lesjoursfr/gdpr-consent)

gdpr-consent.js
================
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

```html
<link rel="stylesheet" href="gdpr-consent.css" />
<script type="text/javascript" src="gdpr-consent.js"></script>
<script type="text/javascript">
GDPRConsent.init({
    "hashtag": "#tarteaucitron", /* Open the panel with this hashtag */
	"cookieName": "tarteaucitron", /* Cookie name */
	"timeExpire": 31536000000, /* Cookie expiration time */

	"websiteName": "Les Jours", /* The name of the Website */

    "highPrivacy": true, /* Disable auto consent */
    "AcceptAllCta" : true, /* Show the accept all button when highPrivacy on */

    "moreInfoLink": true, /* Show more info link */

    "mandatory": false /* Show a message about mandatory cookies */
});
</script>
```

# Add services

```html
<script type="text/javascript">
	/* Initialize gdprconsent.js job array */
	GDPRConsent.job = GDPRConsent.job || [];

	/* Add Google Tag Manager */
	GDPRConsent.user.googletagmanagerId = 'GTMID';
	GDPRConsent.job.push('googletagmanager');

	/* Add Google Analytics (gtag.js) */
	GDPRConsent.user.gtagUa = 'GAID';
	GDPRConsent.user.gtagInitOptions = {};
	GDPRConsent.job.push('gtag');

	/* Add Socials Sharing Services : Twitter & Facebook */
	GDPRConsent.job.push('twitter');
	window.fbAsyncInit = function() { FB.init({}); };
	GDPRConsent.job.push('facebook');
</script>
```
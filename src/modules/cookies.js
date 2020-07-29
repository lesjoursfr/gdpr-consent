const owner = {};

function crossIndexOf(arr, match) {
	"use strict";
	var i;
	for (i = 0; i < arr.length; i += 1) {
		if (arr[i] === match) {
			return true;
		}
	}
	return false;
}

function read(GDPRConsentParameters) {
	"use strict";
	var nameEQ = GDPRConsentParameters.cookieName + "=",
		ca = document.cookie.split(";"),
		i,
		c;

	for (i = 0; i < ca.length; i += 1) {
		c = ca[i];
		while (c.charAt(0) === " ") {
			c = c.substring(1, c.length);
		}
		if (c.indexOf(nameEQ) === 0) {
			return c.substring(nameEQ.length, c.length);
		}
	}
	return "";
}

function create(key, status, GDPRConsentParameters) {
	"use strict";

	var d = new Date(),
		time = d.getTime(),
		expireTime = time + GDPRConsentParameters.timeExpire,
		regex = new RegExp("!" + key + "=(wait|true|false)", "g"),
		cookie = read(GDPRConsentParameters).replace(regex, ""),
		value = GDPRConsentParameters.cookieName + "=" + cookie + "!" + key + "=" + status;

	d.setTime(expireTime);
	document.cookie = value + "; expires=" + d.toGMTString() + "; path=/;";
}

function purge(arr) {
	"use strict";
	var i;

	for (i = 0; i < arr.length; i += 1) {
		document.cookie = arr[i] + "=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/;";
		document.cookie = arr[i] + "=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/; domain=." + location.hostname + ";";
		document.cookie = arr[i] + "=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/; domain=." + location.hostname.split(".").slice(-2).join(".") + ";";
	}
}

function checkCount(key, service, lang) {
	"use strict";
	var arr = service.cookies,
		nb = arr.length,
		nbCurrent = 0,
		html = "",
		i,
		status = document.cookie.indexOf(key + "=true");

	if (status >= 0 && nb === 0) {
		html += lang.useNoCookie;
	} else if (status >= 0) {
		for (i = 0; i < nb; i += 1) {
			if (document.cookie.indexOf(arr[i] + "=") !== -1) {
				nbCurrent += 1;
				if (owner[arr[i]] === undefined) {
					owner[arr[i]] = [];
				}
				if (crossIndexOf(owner[arr[i]], service.name) === false) {
					owner[arr[i]].push(service.name);
				}
			}
		}

		if (nbCurrent > 0) {
			html += lang.useCookieCurrent + " " + nbCurrent + " cookie";
			if (nbCurrent > 1) {
				html += "s";
			}
			html += ".";
		} else {
			html += lang.useNoCookie;
		}
	} else if (nb === 0) {
		html = lang.noCookie;
	} else {
		html += lang.useCookie + " " + nb + " cookie";
		if (nb > 1) {
			html += "s";
		}
		html += ".";
	}

	if (document.getElementById("tacCL" + key) !== null) {
		document.getElementById("tacCL" + key).innerHTML = html;
	}
}

export default {
	read: read,
	create: create,
	purge: purge,
	checkCount: checkCount
};
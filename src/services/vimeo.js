export default () => ({
	key: "vimeo",
	type: "video",
	name: "Vimeo",
	uri: "https://vimeo.com/privacy",
	needConsent: true,
	cookies: ["__utmt_player", "__utma", "__utmb", "__utmc", "__utmv", "vuid", "__utmz", "player"],
	js: function() {
		"use strict";
		var div = document.getElementsByTagName("div"),
			cardClass = "tarteaucitron-vimeo",
			i,
			videoUrl;

		for (i = 0; i < div.length; i++) {
			if (div[i].classList.contains(cardClass)) {
				videoUrl = div[i].getAttribute("data-tarteaucitron-src");
				div[i].innerHTML = "<iframe src=\"" + videoUrl + "\" frameborder=\"0\" allowfullscreen=\"true\"></iframe>";
			}
		}
	},
	fallback: function() {
		"use strict";
		var div = document.getElementsByTagName("div"),
			cardClass = "tarteaucitron-vimeo",
			id = "vimeo",
			i,
			videoUrl;

		for (i = 0; i < div.length; i++) {
			if (div[i].classList.contains(cardClass)) {
				videoUrl = div[i].getAttribute("data-tarteaucitron-src");
				div[i].innerHTML = "<div class=\"tarteaucitron-card-mask\"><span>Le dépôt de cookies pour <span class=\"tarteaucitron-card-type\">" + id + "</span> est désactivé. Si vous souhaitez accéder à ce contenu, merci de l'activer.</span><button onclick=\"GDPRConsent.activate('" + id + "', true)\">Autoriser</button><a href=\"" + videoUrl + "\" class=\"tarteaucitron-card-url\" target=\"_blank\">&rarr; " + videoUrl + "</a></div>";
			}
		}
	}
});
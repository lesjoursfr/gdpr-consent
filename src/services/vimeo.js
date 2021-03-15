import { addScript } from "../utils/dom";

export default () => ({
	key: "vimeo",
	type: "video",
	name: "Vimeo",
	uri: "https://vimeo.com/privacy",
    needConsent: true,
    cookies: ['__utmt_player', '__utma', '__utmb', '__utmc', '__utmv', 'vuid', '__utmz', 'player'],
    js: function() {
        "use strict";
		var div = document.getElementsByTagName("div"),
			cardClass = "tarteaucitron-vimeo",
			i;

		for (i = 0; i < div.length; i++) {
			if (div[i].classList.contains(cardClass)) {
				var videoUrl = div[i].getAttribute("data-tarteaucitron-src"),
					videoFrame = '<iframe src="' + videoUrl + '" frameborder="0" allowfullscreen="true"></iframe>';

					div[i].innerHTML = videoFrame;
			}
		}
    },
    fallback: function() {
        "use strict";
		var div = document.getElementsByTagName("div"),
			cardClass = "tarteaucitron-vimeo",
			id = "vimeo",
			i;

		for (i = 0; i < div.length; i++) {
			if (div[i].classList.contains(cardClass)) {
				var videoUrl = div[i].getAttribute("data-tarteaucitron-src"),
					videoMask = '<div class="tarteaucitron-card-mask"><span>Le dépôt de cookies pour <span class="tarteaucitron-card-type">' + id + '</span> est désactivé. Si vous souhaitez accéder à ce contenu, merci de l’activer.</span><button onclick="GDPRConsent.activate(' + id + ', true);">Autoriser</button><a class="tarteaucitron-card-url" href="' + videoUrl + '" target="_blank">&rarr; ' + videoUrl + '</a></div>';
					div[i].innerHTML = videoMask;
			}
		}
	}
});
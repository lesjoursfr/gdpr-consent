import { escape } from "@lesjoursfr/browser-tools";
import { ServiceInterface, ServiceLoader } from "../interfaces/index.js";

export const youtube = ((): ServiceInterface => {
  return {
    key: "youtube",
    type: "video",
    name: "YouTube",
    uri: "https://policies.google.com/privacy",
    needConsent: true,
    lazyConsent: true,
    cookies: ["VISITOR_INFO1_LIVE", "YSC", "PREF", "GEUP"],
    js: function () {
      const div = document.getElementsByTagName("div");
      const cardClass = "tarteaucitron-youtube";

      for (let i = 0; i < div.length; i++) {
        if (div[i].classList.contains(cardClass)) {
          const videoUrl = div[i].getAttribute("data-tarteaucitron-src") ?? "";
          div[i].innerHTML = '<iframe src="' + escape(videoUrl) + '" frameborder="0" allowfullscreen="true"></iframe>';
        }
      }
    },
    fallback: function () {
      const div = document.getElementsByTagName("div");
      const cardClass = "tarteaucitron-youtube";

      for (let i = 0; i < div.length; i++) {
        if (div[i].classList.contains(cardClass)) {
          const videoUrl = div[i].getAttribute("data-tarteaucitron-src") ?? "";
          div[i].innerHTML =
            '<div class="tarteaucitron-card-mask"><span>Le dépôt de cookies pour <span class="tarteaucitron-card-type">Youtube</span> est désactivé. Si vous souhaitez accéder à ce contenu, merci de l\'activer.</span><button onclick="GDPRConsent.activate(\'youtube\')">Autoriser</button><a href="' +
            escape(videoUrl) +
            '" class="tarteaucitron-card-url" target="_blank">&rarr; ' +
            escape(videoUrl) +
            "</a></div>";
        }
      }
    },
  };
}) as ServiceLoader;
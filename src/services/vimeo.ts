import { escape } from "@lesjoursfr/browser-tools";
import { LangInterface, ServiceInterface, ServiceLoader } from "../interfaces/index.js";

export const vimeo = ((): ServiceInterface => {
  return {
    key: "vimeo",
    type: "video",
    name: "Vimeo",
    uri: "https://vimeo.com/privacy",
    needConsent: true,
    lazyConsent: true,
    cookies: ["__utmt_player", "__utma", "__utmb", "__utmc", "__utmv", "vuid", "__utmz", "player"],
    js: function () {
      const div = document.getElementsByTagName("div");
      const cardClass = "tarteaucitron-vimeo";

      for (let i = 0; i < div.length; i++) {
        if (div[i].classList.contains(cardClass)) {
          const videoUrl = div[i].getAttribute("data-tarteaucitron-src") ?? "";
          div[i].innerHTML = '<iframe src="' + escape(videoUrl) + '" frameborder="0" allowfullscreen="true"></iframe>';
        }
      }
    },
    fallback: function (lang: LangInterface) {
      const div = document.getElementsByTagName("div");
      const cardClass = "tarteaucitron-vimeo";

      for (let i = 0; i < div.length; i++) {
        if (div[i].classList.contains(cardClass)) {
          const videoUrl = div[i].getAttribute("data-tarteaucitron-src") ?? "";
          div[i].innerHTML = `<div class="tarteaucitron-card-mask">
  <span>${lang.placeholder.beforeName} <span class="tarteaucitron-card-type">Vimeo</span> ${lang.placeholder.afterName}</span>
  <button onclick="GDPRConsent.activate('vimeo')">${lang.allow}</button>
  <a href="${escape(videoUrl)}" class="tarteaucitron-card-url" target="_blank">&rarr; ${escape(videoUrl)}</a>
</div>`;
        }
      }
    },
  };
}) as ServiceLoader;

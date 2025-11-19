import { escape } from "@lesjoursfr/browser-tools";
import { LangInterface, ServiceInterface, ServiceLoader } from "../interfaces/index.js";

export const acast = ((): ServiceInterface => {
  return {
    key: "acast",
    type: "audio",
    name: "Acast",
    uri: "https://www.acast.com/en/privacy",
    needConsent: true,
    lazyConsent: true,
    cookies: [],
    js: function () {
      const div = document.getElementsByTagName("div");
      const cardClass = "tarteaucitron-acast";

      for (let i = 0; i < div.length; i++) {
        if (div[i].classList.contains(cardClass)) {
          const videoUrl = div[i].getAttribute("data-tarteaucitron-src") ?? "";
          div[i].innerHTML = `<iframe src="${escape(videoUrl)}" frameborder="0"></iframe>`;
        }
      }
    },
    fallback: function (lang: LangInterface) {
      const div = document.getElementsByTagName("div");
      const cardClass = "tarteaucitron-acast";

      for (let i = 0; i < div.length; i++) {
        if (div[i].classList.contains(cardClass)) {
          const videoUrl = div[i].getAttribute("data-tarteaucitron-src") ?? "";
          div[i].innerHTML = `<div class="tarteaucitron-card-mask">
  <span>${lang.placeholder.beforeName} <span class="tarteaucitron-card-type">Acast</span> ${lang.placeholder.afterName}</span>
  <button onclick="GDPRConsent.activate('acast')">${lang.allow}</button>
  <a href="${escape(videoUrl)}" class="tarteaucitron-card-url" target="_blank">&rarr; ${escape(videoUrl)}</a>
</div>`;
        }
      }
    },
  };
}) as ServiceLoader;

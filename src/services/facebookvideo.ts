import { escape } from "@lesjoursfr/browser-tools";
import { LangInterface, ServiceInterface, ServiceLoader } from "../interfaces/index.js";

export const facebookvideo = ((): ServiceInterface => {
  return {
    key: "facebookvideo",
    type: "video",
    name: "Facebook Video",
    uri: "https://www.facebook.com/privacy/policies/cookies/",
    needConsent: true,
    lazyConsent: true,
    cookies: ["xs", "sb", "fr", "datr", "dpr", "c_user"],
    js: function () {
      const div = document.getElementsByTagName("div");
      const cardClass = "tarteaucitron-facebookvideo";

      for (let i = 0; i < div.length; i++) {
        if (div[i].classList.contains(cardClass)) {
          const videoUrl = div[i].getAttribute("data-tarteaucitron-src") ?? "";
          div[i].innerHTML = '<iframe src="' + escape(videoUrl) + '" frameborder="0" allowfullscreen="true"></iframe>';
        }
      }
    },
    fallback: function (lang: LangInterface) {
      const div = document.getElementsByTagName("div");
      const cardClass = "tarteaucitron-facebookvideo";

      for (let i = 0; i < div.length; i++) {
        if (div[i].classList.contains(cardClass)) {
          const videoUrl = div[i].getAttribute("data-tarteaucitron-src") ?? "";
          div[i].innerHTML = `<div class="tarteaucitron-card-mask">
  <span>${lang.placeholder.beforeName} <span class="tarteaucitron-card-type">Facebook Video</span> ${lang.placeholder.afterName}</span>
  <button onclick="GDPRConsent.activate('facebookvideo')">${lang.allow}</button>
  <a href="${escape(videoUrl)}" class="tarteaucitron-card-url" target="_blank">&rarr; ${escape(videoUrl)}</a>
</div>`;
        }
      }
    },
  };
}) as ServiceLoader;

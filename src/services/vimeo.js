const escape = require('lodash/escape');

export default () => ({
  key: 'vimeo',
  type: 'video',
  name: 'Vimeo',
  uri: 'https://vimeo.com/privacy',
  needConsent: true,
  lazyConsent: true,
  cookies: ['__utmt_player', '__utma', '__utmb', '__utmc', '__utmv', 'vuid', '__utmz', 'player'],
  js: function () {
    'use strict';
    const div = document.getElementsByTagName('div');
    const cardClass = 'tarteaucitron-vimeo';
    let i;
    let videoUrl;

    for (i = 0; i < div.length; i++) {
      if (div[i].classList.contains(cardClass)) {
        videoUrl = div[i].getAttribute('data-tarteaucitron-src');
        div[i].innerHTML = '<iframe src="' + escape(videoUrl) + '" frameborder="0" allowfullscreen="true"></iframe>';
      }
    }
  },
  fallback: function () {
    'use strict';
    const div = document.getElementsByTagName('div');
    const cardClass = 'tarteaucitron-vimeo';
    let i;
    let videoUrl;

    for (i = 0; i < div.length; i++) {
      if (div[i].classList.contains(cardClass)) {
        videoUrl = div[i].getAttribute('data-tarteaucitron-src');
        div[i].innerHTML = "<div class=\"tarteaucitron-card-mask\"><span>Le dépôt de cookies pour <span class=\"tarteaucitron-card-type\">Vimeo</span> est désactivé. Si vous souhaitez accéder à ce contenu, merci de l'activer.</span><button onclick=\"GDPRConsent.activate('vimeo')\">Autoriser</button><a href=\"" + escape(videoUrl) + '" class="tarteaucitron-card-url" target="_blank">&rarr; ' + escape(videoUrl) + '</a></div>';
      }
    }
  }
});

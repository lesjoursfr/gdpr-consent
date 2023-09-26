const defaultLanguage = "en";

export function getLanguage(languages) {
  "use strict";

  if (!navigator) {
    return languages[defaultLanguage];
  }

  const lang =
    navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLang || null;
  const userLanguage = lang ? lang.substr(0, 2) : null;

  if (languages[userLanguage] === undefined) {
    return languages[defaultLanguage];
  }
  return languages[userLanguage];
}

export function getLocale() {
  "use strict";
  if (!navigator) {
    return "en_US";
  }

  const lang =
    navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLang || null;
  const userLanguage = lang ? lang.substr(0, 2) : null;

  if (userLanguage === "fr") {
    return "fr_FR";
  } else {
    return "en_US";
  }
}

import { LangInterface } from "../interfaces/index.js";
import { en } from "./lang.en.js";
import { fr } from "./lang.fr.js";

export { en, fr };

export function getLanguages(): { [key: string]: LangInterface } {
  return {
    fr: fr,
    en: en,
  };
}

const defaultLanguage = "en";

export function getLanguage(languages: { [key: string]: LangInterface }): LangInterface | undefined {
  if (!navigator) {
    return languages[defaultLanguage];
  }

  const lang = navigator.language || null;
  const userLanguage = lang ? lang.substring(0, 2) : null;

  if (userLanguage === null || languages[userLanguage] === undefined) {
    return languages[defaultLanguage];
  }

  return languages[userLanguage];
}

export function getLocale(): string {
  if (!navigator) {
    return "en_US";
  }

  const lang = navigator.language || null;
  const userLanguage = lang ? lang.substring(0, 2) : null;

  if (userLanguage === "fr") {
    return "fr_FR";
  }

  return "en_US";
}

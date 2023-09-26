import fr from "./lang.fr";
import en from "./lang.en";

export { fr, en };

export function getLanguages() {
  return {
    fr: fr,
    en: en,
  };
}

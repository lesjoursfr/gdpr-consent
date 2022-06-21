import fr from "./lang.fr";
import en from "./lang.en";
import { getLanguage } from "../utils/lang";

export default {
  getCurrent: () => {
    switch (getLanguage()) {
      case "fr":
        return fr;
      default:
        return en;
    }
  },
};

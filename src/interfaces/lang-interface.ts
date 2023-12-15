export interface LangInterface {
  alertBigScroll: string;
  alertBigClick: string;
  alertBig: string;

  alertBigPrivacy: string;
  personalize: string;
  acceptAll: string;
  continue: string;
  close: string;

  all: string;

  disclaimer: string;
  disclaimerWebsite: string;

  allow: string;
  deny: string;
  noCookie: string;
  useCookie: string;
  useCookieCurrent: string;
  useNoCookie: string;
  source: string;
  noServices: string;

  title: string;
  newWindow: string;
  allowAll: string;
  denyAll: string;
  save: string;

  ads: {
    title: string;
    details: string;
  };
  analytic: {
    title: string;
    details: string;
  };
  social: {
    title: string;
    details: string;
  };
  video: {
    title: string;
    details: string;
  };
  comment: {
    title: string;
    details: string;
  };
  support: {
    title: string;
    details: string;
  };
  api: {
    title: string;
    details: string;
  };
  other: {
    title: string;
    details: string;
  };

  mandatoryTitle: string;
  mandatoryText: string;
}

export type LanguagesLoader = () => { [key: string]: LangInterface };

export type ServicesCategories = "ads" | "analytic" | "social" | "video" | "comment" | "support" | "api" | "other";

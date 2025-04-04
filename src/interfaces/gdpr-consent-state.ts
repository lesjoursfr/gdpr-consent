import { GDPRConsentParameters } from "./gdpr-consent-parameters.js";
import { GDPRConsentUser } from "./gdpr-consent-user.js";
import { LangInterface, LanguagesLoader } from "./lang-interface.js";
import { ServiceInterface, ServicesLoader } from "./service-interface.js";

export type GDPRConsentState = {
  user: GDPRConsentUser;
  lang: LangInterface;
  services: { [key: string]: ServiceInterface };
  added: { [key: string]: boolean };
  state: { [key: string]: boolean | string };
  launch: { [key: string]: boolean };
  parameters: GDPRConsentParameters;
  reloadThePage: boolean;
  alreadyLaunch: number;
  job: string[];
  withLanguages: (loader: LanguagesLoader) => void;
  withServices: (loader: ServicesLoader) => void;
  init: (params?: Partial<GDPRConsentParameters>) => void;
  load: () => void;
  addService: (serviceId: string) => void;
  cleanArray: (arr: string[]) => string[];
  closePanel: () => void;
  openPanel: () => void;
  respondEffect: (key: string, status: boolean) => void;
  respondAll: (status: boolean) => void;
  respond: (el: HTMLElement, event: MouseEvent) => void;
  activate: (id: string) => void;
  isActivated: (id: string) => boolean;
  toggle: (id: string, closeClass: string) => void;
};

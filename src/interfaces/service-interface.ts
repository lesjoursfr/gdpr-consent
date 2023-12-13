import { GDPRConsentUser } from "./gdpr-consent-user.js";

export interface ServiceInterface {
  key: string;
  type: string;
  name: string;
  uri: string;
  needConsent: boolean;
  lazyConsent: boolean;
  cookies: Array<string> | (() => Array<string>);
  js: () => void;
  fallback?: () => void;
}

export type ServiceLoader = (user: GDPRConsentUser) => ServiceInterface;

export type ServicesLoader = (user: GDPRConsentUser) => { [key: string]: ServiceInterface };

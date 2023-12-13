import { GDPRConsentParameters } from "./interfaces/index.js";

/**
 * GDPR Consent default options
 */
export const DefaulGDPRConsentParameters: GDPRConsentParameters = {
  /**
   * The editor's initial content
   *
   * @type {string}
   * @default "#tarteaucitron"
   */
  hashtag: "#tarteaucitron",
  /**
   * The editor's initial content
   *
   * @type {string}
   * @default "tarteaucitron"
   */
  cookieName: "tarteaucitron",
  /**
   * The editor's height
   *
   * @type {number}
   * @default 31536000000
   */
  timeExpire: 31536000000,
  /**
   * Control if the editor can be resized by the user
   *
   * @type {boolean}
   * @default true
   */
  acceptAllCta: true,
  /**
   * Control if the editor can be resized by the user
   *
   * @type {boolean}
   * @default true
   */
  moreInfoLink: true,
  /**
   * Control if the editor can be resized by the user
   *
   * @type {boolean}
   * @default true
   */
  mandatory: true,
  /**
   * The editor's initial content
   *
   * @type {string}
   * @default window.location.hostname
   */
  websiteName: window.location.hostname,
  /**
   * The editor's initial content
   *
   * @type {string}
   * @default ""
   */
  siteDisclaimerTitle: "",
  /**
   * The editor's initial content
   *
   * @type {string}
   * @default ""
   */
  siteDisclaimerMessage: "",
};

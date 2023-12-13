import { GDPRConsentParameters } from "./interfaces/index.js";

/**
 * GDPR Consent default options
 */
export const DefaulGDPRConsentParameters: GDPRConsentParameters = {
  /**
   * The hashtag to open the GDPR panel
   *
   * @type {string}
   * @default "#tarteaucitron"
   */
  hashtag: "#tarteaucitron",
  /**
   * The cookie's name where to save the user response
   *
   * @type {string}
   * @default "tarteaucitron"
   */
  cookieName: "tarteaucitron",
  /**
   * The cookie's expiration time
   *
   * @type {number}
   * @default 31536000000
   */
  timeExpire: 31536000000,
  /**
   * Control if we must show the "Accept all" button
   *
   * @type {boolean}
   * @default true
   */
  acceptAllCta: true,
  /**
   * Control if we must show the "More info" link on services
   *
   * @type {boolean}
   * @default true
   */
  moreInfoLink: true,
  /**
   * Control if we must show the "Mandatory" message
   *
   * @type {boolean}
   * @default true
   */
  mandatory: true,
  /**
   * Control if we prefer storing the response inside the localStorage instead of the cookies
   *
   * @type {boolean}
   * @default false
   */
  preferLocalStorage: false,
  /**
   * The name of the website
   *
   * @type {string}
   * @default window.location.hostname
   */
  websiteName: window.location.hostname,
  /**
   * The title of the GDPR banner
   *
   * @type {string}
   * @default ""
   */
  siteDisclaimerTitle: "",
  /**
   * The message of the GDPR banner
   *
   * @type {string}
   * @default ""
   */
  siteDisclaimerMessage: "",
};
